## Application Design Patterns

![Hexagonal Architecture](./diagrams/hexagonal-architecture.png)

![Target Architecture](./diagrams/target-architecture.png)

## Exercises

1. Build a basic micro service which returns "Hello World" as the response for any request
1. Change the response from a string to a JavaScript object (something like `{ success: true, message: 'Hello World' }`)
1. Add a rule which responds with a 404 when the browser requests `/favicon.ico`
1. Add unit test(s) to validate the service is working as expected

## Further Reading

* [Hexagonal Architecture](http://fideloper.com/hexagonal-architecture)
* [Micro](https://npmjs.com/package/micro)
* [test-listen](https://npmjs.com/package/test-listen)
* [Now](https://zeit.co/now)
