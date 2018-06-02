const micro = require('micro');
const url = require('url');
const logger = require('../../packages/logger').createLoggers('codes');

const { send } = micro;

const app = micro(async (req, res) => {
  const reqUrl = url.parse(req.url);
  if (reqUrl.pathname == '/favicon.ico') {
    return send(res, 404);
  }

  const parts = reqUrl.pathname.split('/').filter(p => p !== '');
  const code = parts.length ? parts[parts.length - 1] : 200;
  logger.notice({ code, path: reqUrl.pathname });
  return send(res, code, { status: code });
});

module.exports = app;
