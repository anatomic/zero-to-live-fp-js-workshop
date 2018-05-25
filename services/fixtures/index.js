const micro = require('micro');
const url = require('url');
const client = require('prom-client');
const fetch = require('node-fetch');
const Brakes = require('brakes');
const Async = require('crocks/Async');
const propPath = require('crocks/Maybe/propPath');
const identity = require('crocks/combinators/identity');
const map = require('crocks/pointfree/map');
const option = require('crocks/pointfree/option');
const assoc = require('crocks/helpers/assoc');
const compose = require('crocks/helpers/compose');
const mapProps = require('crocks/helpers/mapProps');
const omit = require('crocks/helpers/omit');
const tap = require('crocks/helpers/tap');
const winston = require('winston');
const { lens, over } = require('ramda');

const { sendError, createError } = micro;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

const requestGuage = new client.Gauge({
  name: 'fixturesAPIActiveRequests',
  help: 'Shows the current number of requests being processed',
});
const responseTimer = new client.Histogram({
  name: 'fixturesAPIResponseDuration',
  help: 'Breaks down the length of time required to handle a request',
});
const requestCount = new client.Counter({
  name: 'fixturesAPIRequests',
  help: 'Count of all requests handled',
});

logger.info('Starting up');

const API_KEY = process.env.API_KEY;
const API_BASE = process.env.API_BASE;
const COMPETITION_ID = process.env.COMPETITION_ID;

// This little workaround allows us to have a fallback value if our remote service fails us
let lastKnownGood = {
  count: 0,
  fixtures: [],
  timestamp: Date.now(),
};

const fetchJson = (url, options) => fetch(url, options).then(res => res.json());
const fetchBrake = new Brakes(fetchJson, { timeout: process.env.TIMEOUT });
const fetchm = (url, options) =>
  Async((rej, res) =>
    fetchBrake
      .exec(url, options)
      .then(res)
      .catch(rej)
  );

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

const getFixtures = () =>
  fetchm(`${API_BASE}/competitions/${COMPETITION_ID}/fixtures`, {
    headers: { 'X-Auth-Token': API_KEY },
  })
    .map(parseFixtureResponse)
    .map(tap(_ => logger.info('Received fixtures from upstream')));

const cacheValidResponse = compose(
  tap(_ => logger.debug('cached response')),
  tap(f => (lastKnownGood = f))
);

const app = micro(async (req, res) => {
  const reqUrl = url.parse(req.url);
  if (reqUrl.pathname == '/metrics') {
    return client.register.metrics();
  }

  if (reqUrl.pathname != '/') {
    return sendError(req, res, createError(404, 'Not Found'));
  }

  const end = responseTimer.startTimer();
  requestCount.inc();
  requestGuage.inc();
  return getFixtures()
    .map(cacheValidResponse)
    .coalesce(_ => lastKnownGood, identity)
    .map(tap(_ => requestGuage.dec()))
    .map(tap(_ => end()))
    .toPromise();
});

app.listen(process.env.PORT || 3000);
