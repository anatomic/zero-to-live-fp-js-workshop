# A More Realistic Application

Hello World is great, but it's not giving us the opportunity to really put into practise some of our functional programming ideas. To take things forward, we're going to be building a new microservice which uses our `httpClient` and `logger` from previous modules.

## Exercises

1. Create a microservice which will use the API provided by [https://www.football-data.org](https://www.football-data.org) to return all the fixtures in the upcoming World Cup (again, make it run on localhost:8000)
1. Add logging to emit events detailing requests received and responses sent
1. Add logic to remove the links to original API endpoints (`_links` property in each fixture) and replace them with IDs for the entities
1. Explore using lenses for getting and setting properties on your fixture objects

### Help

* The endpoint for the World Cup API is: [http://api.football-data.org/v1/competitions/467](http://api.football-data.org/v1/competitions/467)
* [https://world-cup-fixtures.now.sh](https://world-cup-fixtures.now.sh) is a live example of the sort of output you should be receiving from your microservice
* You will likely want to sign up for an API token to make sure that your don't fall fowl of the default rate-limiting on the api.football-data.org endpoints

### Example Fixture Object From Source API
```JSON
{
   "result" : {
      "goalsAwayTeam" : null,
      "goalsHomeTeam" : null
   },
   "homeTeamName" : "Russia",
   "status" : "TIMED",
   "date" : "2018-06-14T15:00:00Z",
   "odds" : null,
   "matchday" : 1,
   "_links" : {
      "awayTeam" : {
         "href" : "http://api.football-data.org/v1/teams/801"
      },
      "homeTeam" : {
         "href" : "http://api.football-data.org/v1/teams/808"
      },
      "competition" : {
         "href" : "http://api.football-data.org/v1/competitions/467"
      },
      "self" : {
         "href" : "http://api.football-data.org/v1/fixtures/165069"
      }
   },
   "awayTeamName" : "Saudi Arabia"
}
```

### Example Fixture Object From Our API
```JSON
{
   "fixtureId" : "165069",
   "awayTeamId" : "801",
   "homeTeamName" : "Russia",
   "awayTeamName" : "Saudi Arabia",
   "status" : "TIMED",
   "date" : "2018-06-14T15:00:00.000Z",
   "result" : {
      "goalsHomeTeam" : null,
      "goalsAwayTeam" : null
   },
   "homeTeamId" : "808"
}
```

Next - [process management](./process-management.md)
