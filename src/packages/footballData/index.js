const fetch = require('node-fetch');
const Brakes = require('brakes');
const Async = require('crocks/Async');
const ReaderT = require('crocks/Reader/ReaderT');

const compose = require('crocks/helpers/compose');
const composeK = require('crocks/helpers/composeK');
const defaultProps = require('crocks/helpers/defaultProps');
const propOr = require('crocks/helpers/propOr');
const and = require('crocks/logic/and');
const ifElse = require('crocks/logic/ifElse');
const isNumber = require('crocks/predicates/isNumber');

const { fromAPIResponse } = require('./fixture');

const AsyncReader = ReaderT(Async);
const { Rejected } = Async;
const { ask, lift } = AsyncReader;

const statusCodeIsNumber = compose(isNumber, propOr(false, 'status'));
const statusCodeIsValid = compose(
  code => code >= 200 && code < 400,
  propOr(500, 'status')
);
const isSuccess = and(statusCodeIsNumber, statusCodeIsValid);

const fromJson = r =>
  Async((rej, res) =>
    r
      .json()
      .then(res)
      .catch(rej)
  );

const parseResponse = ifElse(isSuccess, fromJson, Rejected);
const fetchBreaker = new Brakes(fetch, {
  timeout: process.env.TIMEOUT,
  name: 'football-api-fetch',
});
const mfetch = (url, options) =>
  Async((rej, res) =>
    fetchBreaker
      .exec(url, options)
      .then(res)
      .catch(rej)
  );
const fetchJson = composeK(parseResponse, mfetch);

const defaults = defaultProps({
  apiBase: 'http://api.football-data.org/v1',
  timeout: 2000,
});

const fixtures = competitionId =>
  ask(defaults)
    .chain(env =>
      lift(
        fetchJson(`${env.apiBase}/competitions/${competitionId}/fixtures`, {
          headers: {
            'x-request-id': env.requestId,
            'X-Auth-Token': env.apiToken,
          },
          timeout: env.timeout,
        })
      )
    )
    .map(fromAPIResponse);

module.exports = {
  fixtures,
};
