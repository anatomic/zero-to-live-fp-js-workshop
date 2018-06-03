const micro = require('micro');
const url = require('url');
const logger = require('../../packages/logger').createLoggers('codes');
const validCodes = require('./validCodes');

const Either = require('crocks/Either');
const flip = require('crocks/combinators/flip');
const compose = require('crocks/helpers/compose');
const defaultTo = require('crocks/helpers/defaultTo');
const and = require('crocks/logic/and');
const ifElse = require('crocks/logic/ifElse');
const hasProp = require('crocks/predicates/hasProp');
const isNumber = require('crocks/predicates/isNumber');
const isValidCode = flip(hasProp)(validCodes);

const { Left, Right } = Either;

const codeToEither = ifElse(and(isValidCode, isNumber), Right, Left);

const parseCode = pathname => {
  const parts = pathname.split('/').filter(p => p !== '');
  return parts.length ? Number(parts[parts.length - 1]) : 200;
};

const validateCode = compose(codeToEither, defaultTo(200), parseCode);

const { send } = micro;

const app = micro(async (req, res) => {
  const reqUrl = url.parse(req.url);
  if (reqUrl.pathname == '/favicon.ico') {
    return send(res, 404);
  }

  validateCode(reqUrl.pathname).bimap(
    status => {
      logger.notice({
        message: 'Invalid status code supplied',
        path: reqUrl.pathname,
        status,
      });
      send(res, 500, {
        message: 'You have not supplied a valid status code',
        status,
      });
    },
    status => {
      logger.notice({ status, path: reqUrl.pathname });
      send(res, status, { status, message: validCodes[status] });
    }
  );
});

module.exports = app;
