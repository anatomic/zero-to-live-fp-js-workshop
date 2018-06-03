# Starting to write functional JS

This is a *big* topic and one which we can't possibly hope to cover in this workshop. Instead, we're going to pick a specific thing to build (a simple http client) and go ahead and get coding. If this whets your appetite, there's some further reading listed at the end of this post. 

## Get set up

We're going to be exploring a library called [Crocks](https://evilsoft.github.io/crocks/) which offers a reasonably complete (and pragmatic) set of ADTs and helper functions which we can use to write our code in a functional style. We're also going to be using the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) so you'll want to go ahead and install `node-fetch` too.

For some of the examples we're going to see how they work by running small scripts and in other cases we'll be writing some tests. I'd recommend using Jest as your testing framework (it's what I use) but, again, a full introduction to unit testing JavaScript code is beyond the scope of this particular workshop

```bash
yarn add crocks node-fetch
```

## Our First Code - Wrapping the Fetch API

`fetch` is a pretty straightforward function out of the box. If we ignore (for now) the need to set timeouts and set headers we can use it directly as follows:

```JavaScript
#!/usr/bin/env node
const fetch = require('node-fetch');

fetch('http://some.url.com')
    .then(res => console.log(res.status))
    .catch(err => console.error(err));
```

It's a fairly standard Promise based interface, which is great as it makes it easy to wrap with an `Async` from Crocks

```JavaScript
#!/usr/bin/env node
const fetch = require('node-fetch');
const Async = require('crocks/Async');

const mfetch = Async.frompromise(fetch); // That's it!

mfetch('http://some.url.com')
    .fork(
      err => console.error(err),
      res => console.log(res.status)
    );
```

## Next Steps

The above is great, we've got our basic client and it's firing off requests splendidly but it's not the most useful thing ever written. Typically, the response will be checked to make sure it's an expected response type (i.e. check the HTTP status code) and then the body of the response will be parsed into something more useful. For the vast majority of uses we're talking about, this processing starts with getting the body as JSON.

```JavaScript
const toJson = res => res.json(); // this is a promise based API
const promiseToAsync = p => Async((rej, res) => p.then(res).catch(rej));
const jsonAsync = res => promiseToAsync(toJson(res));
```

## Becoming Pointless

The above example works but it's a little uglier than it needs to be and declares more variables (via parameters) than is strictly necessary.

A good habit to get into is looking at places where functions are combined together in some way and seeing if they can be smushed together using a helper function called `compose`. 

```JavaScript
// compose adheres to some basic laws
// given a function f and a function g...
() => f(g()) === compose(f, g); 
```

With our new tool under our belt, let's re-write the previous example (don't forget to add `const compose = require('crocks/helpers/compose');` to the top of your file)

```JavaScript
const toJson = res => res.json();
const promiseToAsync = p => Async((rej, res) => p.then(res).catch(rej));
const jsonAsync = compose(promiseToAsync, toJson);
```

Congratulations, you've just written your first pointfree flow.

## Validating responses

We're nearly there with our basic http client, but one thing's not quite right. What happens when we request something from an API and the response has a status code > 400?

If you're not sure, have a play with your newly written code and a small helper API that's running as part of this workshop - [https://status-code-checker.now.sh](https://status-code-checker.now.sh)

> The API expects queries in the format `status-code-checker.now.sh/:code` where `:code` is a numerical value representing a valid status code (i.e. 404, 500, etc.)

## Exercises

1. Having played around with the functions you've just written, create a new version of `mfetch` which rejects when the response has a status code which implies an unsuccessful request.
2. Create a new function `mfetchJson` which, when called with appropriate parameters creates an Async containing a JSON response (i.e. the body of the response parsed into JavaScript objects)

> Hint, have a look around the crocks documentation to see how you can use predicates and logic functions to build up the various pieces of functionality

## Further Reading

* [Professor Frisby's Modestly Adequate Guide To Functional Programming](https://legacy.gitbook.com/book/mostly-adequate/mostly-adequate-guide/details)