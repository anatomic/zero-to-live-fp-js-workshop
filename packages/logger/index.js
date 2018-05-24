const prop = require('crocks/Maybe/prop');
const safeLift = require('crocks/Maybe/safeLift');
const compose = require('crocks/helpers/compose');
const isString = require('crocks/predicates/isString');
const isObject = require('crocks/predicates/isObject');
const flip = require('crocks/combinators/flip');
const option = require('crocks/pointfree/option');
const chain = require('crocks/pointfree/chain');

const LEVELS = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  NOTICE: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5,
};

// toUpper :: String -> Maybe String
const toUpper = safeLift(isString, s => s.toUpperCase());

// getLevel :: String -> Number
const getLevel = compose(option(2), chain(flip(prop)(LEVELS)), toUpper);

const LOG_LEVEL = getLevel(process.env.LOG_LEVEL);
const ENVIRONMENT = process.env.NODE_ENV || 'production';

// canLog :: String -> Boolean
const canLog = level => getLevel(level) >= LOG_LEVEL;

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
    console.log(
      JSON.stringify({
        tag,
        environment: ENVIRONMENT,
        pid: process.id,
        timestamp: Date.now(),
        dateTime: new Date(),
        level: level.toUpperCase(),
        ...createLogBody(val),
      })
    ),
  val
);

module.exports = log;
