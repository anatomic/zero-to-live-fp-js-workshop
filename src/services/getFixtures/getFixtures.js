const micro = require('micro');
const { send, createError } = micro;
const url = require('url');

const client = require('prom-client');
const Brakes = require('brakes');

const { fixtures } = require('../../packages/footballData/index');

// Set up the environment

const API_TOKEN = process.env.API_TOKEN;
const API_BASE = process.env.API_BASE;
const COMPETITION_ID = process.env.COMPETITION_ID;
const TIMEOUT = process.env.TIMEOUT;

// Setup metrics

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

// Create app logic

const worldCupFixtures = fixtures(COMPETITION_ID);

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

  worldCupFixtures
    .runWith({
      apiBase: API_BASE,
      apiToken: API_TOKEN,
      timeout: TIMEOUT,
    })
    .fork(
      e => {
        requestGauge.dec(); // Need to have this in both branches otherwise leaks be happenin'
        end();
        send(res, e.status || 500, {
          success: false,
          message: e.message || 'Request failed',
        });
      },
      r => {
        send(res, 200, { success: true, ...r });
      }
    );
});

module.exports = app;
