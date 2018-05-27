const API_TOKEN = process.env.API_TOKEN;
const API_BASE = process.env.API_BASE;
const COMPETITION_ID = process.env.COMPETITION_ID;
const TIMEOUT = process.env.TIMEOUT;

const micro = require('micro');

const url = require('url');
const client = require('prom-client');
const Brakes = require('brakes');

const propPath = require('crocks/Maybe/propPath');
const map = require('crocks/pointfree/map');
const option = require('crocks/pointfree/option');
const assoc = require('crocks/helpers/assoc');
const compose = require('crocks/helpers/compose');
const mapProps = require('crocks/helpers/mapProps');
const omit = require('crocks/helpers/omit');
const tap = require('crocks/helpers/tap');
const { lens, over } = require('ramda');

const { fixtures } = require('../../packages/footballData');
const worldCupFixtures = fixtures(COMPETITION_ID);

const log = require('../../packages/logger');

const { createError } = micro;

const logger = log.createLoggers('fixtures-app');

client.collectDefaultMetrics({ timeout: 5000 });

const requestGauge = new client.Gauge({
  name: 'fixturesAPIActiveRequests',
  help: 'Shows the current number of requests being processed',
});
const responseTimer = new client.Summary({
  name: 'fixturesAPIResponseDuration',
  help: 'Breaks down the length of time required to handle a request',
});
const requestCount = new client.Counter({
  name: 'fixturesAPIRequests',
  help: 'Count of all requests handled',
});

logger.info('starting up');

// This little workaround allows us to have a fallback value if our remote service fails us
let lastKnownGood = {
  count: 0,
  fixtures: [],
  timestamp: Date.now(),
};

const toDate = d => new Date(d);

const fixtureIdL = lens(
  propPath(['_links', 'self', 'href']),
  assoc('fixtureId')
);
const homeIdL = lens(
  propPath(['_links', 'homeTeam', 'href']),
  assoc('homeTeamId')
);
const awayIdL = lens(
  propPath(['_links', 'awayTeam', 'href']),
  assoc('awayTeamId')
);
const parseId = compose(option(null), map(link => /.*?(\d+)$/.exec(link)[1]));

const omitMeta = omit(['_links', 'odds', 'matchday']);

const parseFixture = compose(
  mapProps({ date: toDate }),
  omitMeta,
  over(awayIdL, parseId),
  over(homeIdL, parseId),
  over(fixtureIdL, parseId)
);

const parseFixtureResponse = compose(
  mapProps({ fixtures: map(parseFixture) }),
  assoc('timestamp', Date.now()),
  omitMeta
);

const app = micro(async (req, res) => {
  const end = responseTimer.startTimer();
  const reqUrl = url.parse(req.url);
  if (reqUrl.pathname === '/metrics') {
    return client.register.metrics();
  }

  if (reqUrl.pathname === '/hystrix.stream') {
    res.setHeader('Content-Type', 'text/event-stream;charset=UTF-8');
    res.setHeader(
      'Cache-Control',
      'no-cache; no-store; max-age=0; must-revalidate'
    );
    res.setHeader('Pragma', 'no-cache');
    return Brakes.getGlobalStats().getHystrixStream();
  }

  if (reqUrl.pathname !== '/') {
    throw createError(404, 'Not Found');
  }

  requestCount.inc();
  requestGauge.inc();
  return worldCupFixtures
    .runWith({
      apiBase: API_BASE,
      apiToken: API_TOKEN,
      timeout: TIMEOUT,
    })
    .map(tap(_ => requestGauge.dec()))
    .map(tap(_ => end()))
    .toPromise();
});

app.listen(process.env.PORT || 3000);
