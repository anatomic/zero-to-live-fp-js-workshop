const app = require('./getFixtures');
app.listen(process.env.PORT || 8000);

console.log(process.env.API_BASE);