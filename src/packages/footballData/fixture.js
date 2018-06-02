const propPath = require('crocks/Maybe/propPath');
const map = require('crocks/pointfree/map');
const option = require('crocks/pointfree/option');
const assoc = require('crocks/helpers/assoc');
const compose = require('crocks/helpers/compose');
const mapProps = require('crocks/helpers/mapProps');
const omit = require('crocks/helpers/omit');

const { lens, over } = require('ramda');

const toDate = d => new Date(d);

const fixtureIdL = lens(
  propPath(['_links', 'self', 'href']),
  assoc('fixtureId')
);
const homeIdL = lens(
  propPath(['_links', 'homeTeam', 'href']),
  assoc('homeTeamId')
);
const awayIdL = lens(
  propPath(['_links', 'awayTeam', 'href']),
  assoc('awayTeamId')
);
const parseId = compose(option(null), map(link => /.*?(\d+)$/.exec(link)[1]));

const omitMeta = omit(['_links', 'odds', 'matchday']);

const parseFixture = compose(
  mapProps({ date: toDate }),
  omitMeta,
  over(awayIdL, parseId),
  over(homeIdL, parseId),
  over(fixtureIdL, parseId)
);

const fromAPIResponse = compose(
  mapProps({ fixtures: map(parseFixture) }),
  assoc('timestamp', Date.now()),
  omitMeta
);

module.exports = {
  fromAPIResponse,
};
