# Configuration

> A litmus test for whether an app has all config correctly factored out of the code is whether the codebase could be made open source at any moment, without compromising any credentials.

## Managing Secrets

> The twelve-factor app stores config in environment variables (often shortened to env vars or env). Env vars are easy to change between deploys without changing any code; unlike config files, there is little chance of them being checked into the code repo accidentally; and unlike custom config files, or other config mechanisms such as Java System Properties, they are a language- and OS-agnostic standard.

There are various methods available manage secrets and environment variables. Locally we will use our process manager configuration to handle our local environment variables and the test/staging/production environments will be managed by the platform you use to run your applications. For the majority of this workshop we'll be referencing configuration for the Now platform, but similar ideas exist whether you're deploying to kubernetes, a cloud provider, PAAS (like heroku) or *gasp* via virtual machines (using Chef, Puppet, Ansible, or otherwise).

## Exercises

1. Take the hard coded secrets and configuration out of your app and retrieve them from the environment

## Further Reading

* [Hashicorp Vault](https://www.vaultproject.io/)
* [Consul](https://www.consul.io/)
* [Zookeeper](https://zookeeper.apache.org/)
* [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
* [Now Environment Variables and Secrets](https://zeit.co/blog/environment-variables-secrets)
