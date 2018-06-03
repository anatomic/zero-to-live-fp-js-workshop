# Logging

Logging is an area where we start to seek out the more pragmatic side of functional programming in JavaScript.

> A twelve-factor app never concerns itself with routing or storage of its output stream. It should not attempt to write to or manage logfiles. Instead, each running process writes its event stream, unbuffered, to stdout. During local development, the developer will view this stream in the foreground of their terminal to observe the app’s behavior.

## Log Levels

## Log Format

## Exercises

1. Write a **really** basic logger which takes a message, decorates it with some useful stuff (like timestamp, environment, etc.) and then writes out to `stdout`.
1. Introduce the concept of log levels to your logger ([see here for more information]())
1. Add the ability to only log certain levels and higher (i.e. Notice, Warn, Error, Fatal) by setting a flag as an environment variable (e.g. `LOG_LEVEL=debug`)

### Extension Task

1. Add some colour to your log output!

## Further Reading

* [Logs and metrics](https://medium.com/@copyconstruct/logs-and-metrics-6d34d3026e38)
* [Bunyan](https://npmjs.org/package/bunyan)
* [Winston](https://npmjs.org/package/winston)
* [fluentd](https://www.fluentd.org/)
* [ELK Stack](https://www.elastic.co/elk-stack)
* [Why JSON is the best application log format](https://www.loggly.com/blog/why-json-is-the-best-application-log-format-and-how-to-switch/)

Next - [Create a simple HTTP API](./a-simple-application.md)
