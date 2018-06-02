const app = require('./codes');
const logger = require('../../packages/logger').createLoggers('codes');

const port = process.env.PORT || 8000;

logger.notice({ port, message: 'starting application' });
app.listen(port);
