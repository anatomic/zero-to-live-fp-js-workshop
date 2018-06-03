# Circuit Breaker

> Circuit breakers are effective at guarding against integration points, cascading failures, unbalanced capacities, and slow responses.

## Modelling Failure Locally

tl;dr Use toxiproxy and inject failure to watch things crumble (or not, after all, you're implementing the Circuit Breaker pattern!)

## Exercises

1. Using the `httpClient` you wrote in the [first part of the workshop](./fp-js.md), create a new version of the client which includes a circuit breaker
1. Update your world cup fixtures application to use your newly created circuit breaker version of httpClient


## Further Reading

* [Hystrix](https://github.com/Netflix/Hystrix)
* [Release It!](https://pragprog.com/book/mnee2/release-it-second-edition)
* [Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html)
* [Brakes](https://npmjs.com/package/brakes)
* [Toxiproxy](https://github.com/Shopify/toxiproxy)
