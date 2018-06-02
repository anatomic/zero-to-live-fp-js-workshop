const Brakes = require('brakes');
const Async = require('crocks/Async');
const fetch = require('node-fetch');

const assoc = require('crocks/helpers/assoc');
const compose = require('crocks/helpers/compose');
const composeK = require('crocks/helpers/composeK');
const curry = require('crocks/helpers/curry');
const defaultTo = require('crocks/helpers/defaultTo');
const propOr = require('crocks/helpers/propOr');
const and = require('crocks/logic/and');
const ifElse = require('crocks/logic/ifElse');
const isNumber = require('crocks/predicates/isNumber');

const { Rejected } = Async;

const log = curry((tag, val) => (console.log(tag, val), val));

const mfetch = Async.fromPromise(fetch); //can't do this anymore...
const toJson = res => res.json();
const promiseToAsync = p => Async((rej, res) => p.then(res).catch(res));
const jsonAsync = compose(promiseToAsync, toJson);

const isValidStatusCode = code => code >= 200 && code < 400;
const isValidResponse = compose(
  and(isNumber, isValidStatusCode),
  propOr(500, 'status')
);

const parseJson = ifElse(
  isValidResponse,
  jsonAsync,
  composeK(Rejected, jsonAsync)
);

const mfetchJson = composeK(parseJson, mfetch);

const BREAKER_DEFAULTS = {
  timeout: 1000,
  isPromise: true,
  isFunction: false,
};

const createBreaker = (name, options) => {
  const defaults = assoc('name', name, BREAKER_DEFAULTS);
  const fetchBreaker = new Brakes(fetch, defaultTo(defaults, options));

  const mfetch = (url, options) =>
    Async((rej, res) =>
      fetchBreaker
        .exec(url, options)
        .then(res)
        .catch(rej)
    );
  const mfetchJson = composeK(parseJson, mfetch);
  return {
    mfetch,
    mfetchJson,
  };
};

module.exports = {
  mfetch,
  mfetchJson,
  createBreaker,
};
