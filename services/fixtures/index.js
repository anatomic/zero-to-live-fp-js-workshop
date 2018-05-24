const micro = require('micro');
const metrics = require('metrics');
const fetch = require('node-fetch');
const Brakes = require('brakes');
const Async = require('crocks/Async');
const map = require('crocks/pointfree/map');
const assoc = require('crocks/helpers/assoc');
const compose = require('crocks/helpers/compose');
const mapProps = require('crocks/helpers/mapProps');
const pick = require('crocks/helpers/pick');
const tap = require('crocks/helpers/tap');
const winston = require('winston');

const { send } = micro;
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

const report = new metrics.Report();
const reporter = new metrics.ConsoleReporter(report);
const counter = new metrics.Counter();
report.addMetric('com.worldcup.fixtures.requests', counter);
reporter.start(10000);

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

const parseFixture = compose(
  mapProps({ date: toDate }),
  pick(['date', 'status', 'matchday', 'homeTeamName', 'awayTeamName', 'result'])
);

const parseFixtureResponse = compose(
  mapProps({ fixtures: map(parseFixture) }),
  pick(['count', 'fixtures'])
);

const getFixtures = () =>
  fetchm(`${API_BASE}/competitions/${COMPETITION_ID}/fixtures`, {
    headers: { 'X-Auth-Token': API_KEY },
  })
    .map(parseFixtureResponse)
    .map(tap(_ => logger.info('Received fixtures from upstream')));

const cacheValidResponse = compose(
  tap(_ => logger.debug("cached response")),
  assoc('timestamp', Date.now()),
  tap(f => (lastKnownGood = f))
);

const app = micro(async (req, res) => {
  counter.inc();
  return getFixtures()
    .map(cacheValidResponse)
    .bimap(_ => send(res, 200, lastKnownGood), f => send(res, 200, f))
    .toPromise();
});

app.listen(process.env.PORT || 3000);
