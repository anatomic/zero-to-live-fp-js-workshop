const micro = require('micro');

const app = micro(async (req, res) => {
  return 'hello world';
});

module.exports = app;