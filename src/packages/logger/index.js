const prop = require('crocks/Maybe/prop');
const safeLift = require('crocks/Maybe/safeLift');
const compose = require('crocks/helpers/compose');
const isNumber = require('crocks/predicates/isNumber');
const isString = require('crocks/predicates/isString');
const isObject = require('crocks/predicates/isObject');
const flip = require('crocks/combinators/flip');
const option = require('crocks/pointfree/option');
const chain = require('crocks/pointfree/chain');

const LEVELS = {
  TRACE: 7,
  DEBUG: 6,
  INFO: 5,
  NOTICE: 4,
  WARN: 3,
  ERROR: 2,
  ALERT: 1,
  FATAL: 0,
};

// toUpper :: String -> Maybe String
const toUpper = safeLift(isString, s => s.toUpperCase());

// getLevel :: String -> Number
const getLevel = compose(option(3), chain(flip(prop)(LEVELS)), toUpper);

let LOG_LEVEL = getLevel(process.env.LOG_LEVEL); // don't judge the 'let', it's handy
const ENVIRONMENT = process.env.NODE_ENV || 'production';

// canLog :: String -> Boolean
const canLog = level => getLevel(level) <= LOG_LEVEL;

// createLogBody :: (String|Number|Object|*) -> Object
const createLogBody = val => {
  switch (true) {
    case isObject(val): {
      return { body: val };
    }
    case isString(val): {
      return { message: val };
    }
    case isNumber(val): {
      return { value: val };
    }
    default: {
      return {};
    }
  }
};

// log :: String -> String -> a -> a
const log = level => tag => val => (
  canLog(level) &&
    console.log(
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

// createLogs :: String -> Logger
const createLogs = tag =>
  Object.keys(LEVELS)
    .map(l => l.toLowerCase())
    .reduce((acc, l) => ({ ...acc, [l]: log(l)(tag) }), {});

// setLevel :: String -> Unit
const setLevel = level => (LOG_LEVEL = getLevel(level));

log.createLoggers = createLogs;
log.setLevel = setLevel;

module.exports = log;
