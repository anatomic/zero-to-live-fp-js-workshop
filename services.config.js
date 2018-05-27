module.exports = {
  apps: [
    {
      name: 'fixtures',
      script: './services/fixtures/index.js',
      exec_mode: 'cluster',
      instances: 1,
      watch: true,
      env: {
        PORT: 8000,
        API_TOKEN: 'c1f33647715444d5897b249e5245c56d',
        API_BASE: 'http://api.football-data.org/v1',
        COMPETITION_ID: 467,
        LOG_LEVEL: 'debug',
        NODE_ENV: 'development',
        TIMEOUT: 1000,
      },
      env_production: {
        NODE_ENV: 'production',
        LOG_LEVEL: 'info',
      },
    },
  ],
};
