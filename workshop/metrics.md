# Metrics



## Why do you need metrics when you have logs?

From Cindy Sridharan's article [Logs and Metrics](https://medium.com/@copyconstruct/logs-and-metrics-6d34d3026e38):

> Since metrics are just numbers measured over intervals of time, they can be compressed, stored, processed and retrieved far more efficiently than logs representing plaintext records or JSON blobs. Metrics are optimized for storage and enable longer retention of data, which can in turn be used to build dashboards to reflect historical trends. Additionally, metrics better allow for gradual reduction of data resolution over time, so that after a certain period of time data can be aggregated into daily or weekly frequency.

Metrics give you a great way to introduce observability into your app without necessarily incurring the overhead of shipping, storing and processing logs. For example, if your traffic scales dramatically, typically your metrics data rate stays constant (just the numbers it's reporting are different). However, if your traffic scales dramatically, chances are your log volume will scale proportionally with the traffic. This can get difficult to manage (disk's filling up and causing issues) and potentially very expensive (depending on the hardward and licensing costs of your log aggregation and processing etc.).

## Going beyond the basics

Different runtime environments offer different solutions for metrics. For some systems (e.g. Prometheus) where scraping is the default method of ingesting metrics, there's some consideration required around how to get metrics from individual instances (aka processes) of your app. This is beyond the scope of this workshop but it's worth taking some time to learn about this by yourself.

Other systems (for example statsd) will not have the same issues for multiple processes as, by default, you are pushing metrics to a single collection agent from each individual process.

## Further Reading

* [Logs and metrics](https://medium.com/@copyconstruct/logs-and-metrics-6d34d3026e38)
* [The RED Method](https://thenewstack.io/monitoring-microservices-red-method/)
* [The RED Method (video)](https://www.youtube.com/watch?v=TJLpYXbnfQ4)
* [Prometheus](https://prometheus.io/)
* [statsd](https://github.com/etsy/statsd)
* [Graphite](https://graphiteapp.org/)
* [Grafana](https://grafana.com/)
* [telegraf](https://www.influxdata.com/time-series-platform/telegraf/)
* [pagerduty](https://www.pagerduty.com/)