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

## Further Reading

* [Professor Frisby's Modestly Adequate Guide To Functional Programming](https://legacy.gitbook.com/book/mostly-adequate/mostly-adequate-guide/details)