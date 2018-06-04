const ReaderT = require('crocks/Reader/ReaderT');
const Maybe = require('crocks/Maybe');
const safe = require('crocks/Maybe/safe');
const isNumber = require('crocks/predicates/isNumber');
const and = require('crocks/logic/and');

const MaybeReader = ReaderT(Maybe);
const { ask, liftFn } = MaybeReader;
const { Just, Nothing } = Maybe;

// add :: Number -> Number -> Number
const add = x => y => x + y;

// Typical Constructor
MaybeReader(safe(isNumber)).runWith(76);
//=> Just 76

MaybeReader(safe(isNumber)).runWith('76');
//=> Nothing

// Using `ask` with no function
// (identity on environment)
console.log(ask().runWith(76));
//=> Just 76

console.log(ask().runWith('76'));
//=> Just '76'

// Using `ask` with a function
// (map environment before deposit)
console.log(ask(add(10)).runWith(76));
//=> Just 86

const isNotZero = n => n !== 0;
const isValidDenominator = and(isNumber, isNotZero);
const safeFraction = num => den =>
  isValidDenominator(den) ? Just(num / den) : Nothing();

const _safeFraction = liftFn(safeFraction(1)); // lifts into MaybeReader

console.log(
  ask()
    .chain(_safeFraction)
    .runWith(10)
);
console.log(
  ask()
    .chain(_safeFraction)
    .map(v => v * 10) // maps over inner value of Maybe
    .runWith(4)
);
console.log(
  ask()
    .chain(_safeFraction)
    .map(v => v * 10) // not called as previous step in flow returns Nothing
    .runWith(0)
);

console.log(
  ask()
    .chain(_safeFraction)
    .chain(_safeFraction) // Not called as previous step in flow returns Nothing
    .runWith(0)
);

console.log(
  ask()
    .chain(_safeFraction)
    .chain(_safeFraction) // This is called as previous element is a Just
    .runWith(10) // returns 10 -- see below
);

/**
 * steps to create last value --
 * env is set to 10
 * first chain is Just(1/10) === Just(0.1)
 * second chain is Just(1/0.1) === Just(10) ~ the output from the previous value becomes the `den`
 */

const add10ToEnv = ask(x => x + 10);
const add20ToEnv = ask(x => x + 20); // x will be set to the value provided in runWith
const flow = add10ToEnv.chain(x => add20ToEnv.map(y => x + y));

console.log(flow.runWith(1)); // Just(1 + 10) + Just(1 + 20) = Just 32
console.log(flow.runWith(10)); // Just(10 + 10) + Just(10 + 20) = Just 50
