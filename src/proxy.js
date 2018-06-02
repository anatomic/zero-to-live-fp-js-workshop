const createProxy = require('micro-proxy');
const proxy = createProxy([
  { pathname: '/status-codes', method: ['GET'], dest: 'http://localhost:8002' },
  { pathname: '/hello-world', method: ['GET'], dest: 'http://localhost:8000' },
  { pathname: '/fixtures', method: ['GET'], dest: 'http://localhost:8001' },
]);

proxy.listen(process.env.PORT || 3000, e => {
  if (e) throw e;

  console.log('proxy up and running');
});
