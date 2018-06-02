const Async = require('crocks/Async');
const fetch = require('node-fetch');

const compose = require('crocks/helpers/compose');
const composeK = require('crocks/helpers/composeK');
const propOr = require('crocks/helpers/propOr');
const and = require('crocks/logic/and');
const ifElse = require('crocks/logic/ifElse');
const isNumber = require('crocks/predicates/isNumber');

const { Rejected } = Async;

const mfetch = Async.fromPromise(fetch);
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

module.exports = {
  mfetch,
  mfetchJson
};
