# Logging

Logging is an area where we start to seek out the more pragmatic side of functional programming in JavaScript.

> A twelve-factor app never concerns itself with routing or storage of its output stream. It should not attempt to write to or manage logfiles. Instead, each running process writes its event stream, unbuffered, to stdout. During local development, the developer will view this stream in the foreground of their terminal to observe the app’s behavior.

So, in a nutshell, we're going to be sending stuff out from our app using the honourable `console.log`!

## Log Levels

We'll be using the logging levels as defined by The Syslog Protocol RFC:

| Numerical Code | Severity |
| --- | --- |
| 0 | Emergency: system is unusable |
| 1 | Alert: action must be taken immediately |
| 2 | Critical: critical conditions |
| 3 | Error: error conditions |
| 4 | Warning: warning conditions |
| 5 | Notice: normal but significant condition |
| 6 | Informational: informational messages |
| 7 | Debug: debug-level messages |

## Log Format

There's various schools of thought about how to structure your log output, ultimately it comes down to what's going to be most useful for your use-case. We'll favour outputting everything 

Example of common log format:
```bash
127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326
```

Example of JSON log format:
```JavaScript
{"tag":"codes","environment":"development","pid":83407,"ppid":82653,"platform":"darwin","timestamp":1528069192556,"dateTime":"2018-06-03T23:39:52.556Z","level":"NOTICE","body":{"message":"Invalid status code supplied","path":"/status-codes/509","status":509}}
```

Whichever format you choose to go with, keep in mind that logging is most effective when your log is output on a single line.

## Integrating With ADTs

As well as being an awesome library for working with ADTs, crocks is also a pragmatic library for working with ADTs. While some camps won't be happy with some of the choices we'll make around exposing side-effects (such as logging), there's no point in getting overly het up about making JavaScript behave *exactly* like Haskell. For a start, it can't, so let's embrace some pragmatism and make use of the incredibly helpful `tap` function provided by Crocks.

```haskell
tap :: (a -> b) -> a -> a
```

Example of using `tap` in the node REPL:
```bash
> const tap = require('crocks/helpers/tap');
undefined
> [1, 2, 3, 4].map(tap(console.log))
1
2
3
4
[ 1, 2, 3, 4 ]
```

## Exercises

1. Write a **really** basic logger which takes a message, decorates it with some useful stuff (like timestamp, environment, etc.) and then writes out to `stdout`.
1. Introduce the concept of log levels to your logger so you can indicate severity
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
* [Write Logs for Machines, Use JSON](https://paul.querna.org/articles/2011/12/26/log-for-machines-in-json/)
* [Common Log Format](https://en.wikipedia.org/wiki/Common_Log_Format)

Next - [Create a simple HTTP API](./a-simple-application.md)
