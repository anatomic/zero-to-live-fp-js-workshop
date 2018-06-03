const Reader = require('crocks/Reader');
const concat = require('crocks/pointfree/concat');

const { ask } = Reader;

// greet :: String -> Reader String String
const greet = greeting => Reader(name => `${greeting}, ${name}`);

// addFarewell :: String -> Reader String String
const addFarewell = farewell => str => ask(env => `${str}${farewell} ${env}`);

// flow :: Reader String String
const flow = greet('Hola')
  .map(concat('...'))
  .chain(addFarewell('See Ya'));

console.log(flow.runWith('Thomas'));
// => Hola, Thomas...See Ya Thomas

console.log(flow.runWith('Jenny'));
// => Hola, Jenny...See Ya Jenny
