const prop = require('crocks/Maybe/prop');
const safeLift = require('crocks/Maybe/safeLift');
const compose = require('crocks/helpers/compose');
const isString = require('crocks/predicates/isString');
const isObject = require('crocks/predicates/isObject');
const flip = require('crocks/combinators/flip');
const option = require('crocks/pointfree/option');
const chain = require('crocks/pointfree/chain');

const LEVELS = {
  TRACE: 6,
  DEBUG: 5,
  INFO: 4,
  NOTICE: 3,
  WARN: 2,
  ERROR: 1,
  FATAL: 0,
};

// We need to be able to inject a new reporter
let reporter = console.log;

// toUpper :: String -> Maybe String
const toUpper = safeLift(isString, s => s.toUpperCase());

// getLevel :: String -> Number
const getLevel = compose(option(2), chain(flip(prop)(LEVELS)), toUpper);

const LOG_LEVEL = getLevel(process.env.LOG_LEVEL);
const ENVIRONMENT = process.env.NODE_ENV || 'production';

// canLog :: String -> Boolean
const canLog = level => getLevel(level) <= LOG_LEVEL;

// createLogBody :: Any -> Object
const createLogBody = val => {
  switch (true) {
    case isObject(val): {
      return { body: val };
    }
    case isString(val): {
      return { message: val };
    }
    default: {
      return {};
    }
  }
};

const log = level => tag => val => (
  canLog(level) &&
    reporter(
      JSON.stringify({
        tag,
        environment: ENVIRONMENT,
        pid: process.pid,
        ppid: process.ppid,
        platform: process.platform,
        timestamp: Date.now(),
        dateTime: new Date(),
        level: level.toUpperCase(),
        ...createLogBody(val),
      })
    ),
  val
);

const createLogs = tag =>
  Object.keys(LEVELS)
    .map(l => l.toLowerCase())
    .reduce((acc, l) => ({ ...acc, [l]: log(l)(tag) }), {});

log.createLoggers = createLogs;
log.setReporter = f => {
  reporter = f;
};
module.exports = log;
