# Configuration

> A litmus test for whether an app has all config correctly factored out of the code is whether the codebase could be made open source at any moment, without compromising any credentials.

## Managing Secrets

> The twelve-factor app stores config in environment variables (often shortened to env vars or env). Env vars are easy to change between deploys without changing any code; unlike config files, there is little chance of them being checked into the code repo accidentally; and unlike custom config files, or other config mechanisms such as Java System Properties, they are a language- and OS-agnostic standard.

There are various methods available manage secrets and environment variables. Locally we will use our process manager configuration to handle our local environment variables and the test/staging/production environments will be managed by the platform you use to run your applications. For the majority of this workshop we'll be referencing configuration for the Now platform, but similar ideas exist whether you're deploying to kubernetes, a cloud provider, PAAS (like heroku) or *gasp* via virtual machines (using Chef, Puppet, Ansible, or otherwise).

## Introducing Reader

> `Reader` is a lazy Product Type that enables the composition of computations that depend on a shared environment `(e -> a)`. The left portion, the `e` must be fixed to a type for all related computations. The right portion `a` can vary in its type.

I'm sure this description is perfectly accessible for people well versed in category theory and Haskell data types, but for mere mortals like myself it requires further explanation. 

The simplest way to understand Reader is that it provides a way to provide read-only data to any function (computation). So, for example, in our application where we have a specific base URL for calls to the football-data API, we may choose to pass this to our functions by wrapping them in a Reader rather than reaching into the `process.env` global (which is impure).

## Working wih ReaderT

> `ReaderT` is a Monad Transformer that wraps a given Monad with a `Reader`. This allows the interface of a Reader that enables the composition of computations that depend on a shared environment `(e -> a)`, but provides a way to abstract a means the `Reader` portion, when combining `ReaderT`s of the same type. All `ReaderT`s must provide the constructor of the target Monad that is being wrapped.

Ok, so in my opinion this is even harder to get into than before but is ultimately the most useful way of interacting with a Reader. What ReaderT is doing is embellishing the behaviour of the underlying Monad with the environment access features of a Reader.

It may not be immediately obvious when using this in simple examples such as those in this workshop, however, as your applications grow and the flows begin to have multiple steps (for example, multiple http requests) then having the ability to access the environment in any discrete step is very helpful indeed. This also allows us to split up the steps into discrete chunks to allow easier testing...

## Exercises

1. Take the hard coded secrets and configuration out of your world cup microservice and retrieve them from the environment. *Consider which elements of your application may need to differ between environments (this includes testing environments which run unit and integration tests)*
1. Introduce ReaderT into your application to provide configuration to your Async wrapped side-effects

## Further Reading

* [`Reader` documentation](https://evilsoft.github.io/crocks/docs/crocks/Reader.html)
* [`ReaderT` documentation](https://evilsoft.github.io/crocks/docs/crocks/ReaderT.html)
* [Hashicorp Vault](https://www.vaultproject.io/)
* [Consul](https://www.consul.io/)
* [Zookeeper](https://zookeeper.apache.org/)
* [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
* [Now Environment Variables and Secrets](https://zeit.co/blog/environment-variables-secrets)
