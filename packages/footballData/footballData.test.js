const { fixtures } = require('./index');
const fetch = require('node-fetch');

const fail = done => e => done.fail(e);

const API_RESPONSE = require('./__fixtures__/world-cup-fixtures');

const TIMEOUT = 2000;
const API_BASE = 'http://api.test.com';
const API_TOKEN = 'testToken';
const REQUEST_ID = 12345;
const COMPETITION_ID = 467;
const getWorldCupFixtures = fixtures(COMPETITION_ID);

const defaultEnvironment = {
  apiToken: API_TOKEN,
  requestId: REQUEST_ID,
  apiBase: API_BASE,
};

describe('fixtures client', () => {
  test('Client uses passed in environment correctly', done => {
    fetch.setResponse({ payload: Promise.resolve(API_RESPONSE) });
    getWorldCupFixtures.runWith(defaultEnvironment).fork(fail(done), r => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE}/competitions/${COMPETITION_ID}/fixtures`,
        {
          headers: {
            'X-Auth-Token': API_TOKEN,
            'x-request-id': REQUEST_ID,
          },
          timeout: TIMEOUT,
        }
      );
      expect(fetch.response.json).toHaveBeenCalled();
      done();
    });
  });

  describe('status > 400 results in a Rejected Async', () => {
    [400, 401, 402, 403, 500].forEach(status => {
      test(`status ${status} is Rejected`, done => {
        fetch.setResponse({ status: status });
        getWorldCupFixtures.runWith(defaultEnvironment).fork(e => {
          expect(e).toHaveProperty('status', status);
          done();
        }, fail(done));
      });
    });

    [399, 200, 202].forEach(status => {
      test(`status ${status} is Resolved`, done => {
        fetch.setResponse({
          status: status,
          payload: Promise.resolve(API_RESPONSE),
        });
        getWorldCupFixtures.runWith(defaultEnvironment).fork(fail(done), r => {
          expect(r).toBeTruthy();
          done();
        });
      });
    });
  });

    test("fixtures are mapped to our model from the API response", done => {
      fetch.setResponse({ payload: Promise.resolve(API_RESPONSE) });
      getWorldCupFixtures.runWith(defaultEnvironment).fork(fail(done), r => {
        expect(r.fixtures).toHaveLength(API_RESPONSE.count);
        r.fixtures.forEach(f => {
          expect(f).not.toHaveProperty('_links');
        });
        expect(r.fixtures).toMatchSnapshot();
        done();
      });
    });
});
