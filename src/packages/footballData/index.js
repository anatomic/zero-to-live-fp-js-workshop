const fetch = require('node-fetch');
const Async = require('crocks/Async');
const Pred = require('crocks/Pred');
const ReaderT = require('crocks/Reader/ReaderT');

const flip = require('crocks/combinators/flip');
const compose = require('crocks/helpers/compose');
const defaultProps = require('crocks/helpers/defaultProps');
const propOr = require('crocks/helpers/propOr');
const ifElse = require('crocks/logic/ifElse');
const runWith = require('crocks/pointfree/runWith');
const isNumber = require('crocks/predicates/isNumber');

const { fromAPIResponse } = require('./fixture');

const AsyncReader = ReaderT(Async);
const { Rejected } = Async;
const { ask, lift } = AsyncReader;

const statusCodeIsNumber = compose(isNumber, propOr(false, 'status'));

const isSuccess = flip(runWith)(
  Pred(statusCodeIsNumber).concat(
    Pred(({ status }) => status >= 200 && status < 400)
  )
);

const fromJson = r =>
  Async((rej, res) =>
    r
      .json()
      .then(res)
      .catch(rej)
  );

const parseResponse = ifElse(isSuccess, fromJson, Rejected);
const fetchm = Async.fromPromise(fetch);
const fetchJson = (url, options) => fetchm(url, options).chain(parseResponse);

const defaults = defaultProps({
  apiBase: 'http://api.football-data.org/v1',
  timeout: 2000,
});

const fixtures = competitionId =>
  ask(defaults).chain(env =>
    lift(
      fetchJson(`${env.apiBase}/competitions/${competitionId}/fixtures`, {
        headers: {
          'x-request-id': env.requestId,
          'X-Auth-Token': env.apiToken,
        },
        timeout: env.timeout,
      }).map(fromAPIResponse)
    )
  );

module.exports = {
  fixtures,
};
