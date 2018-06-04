module.exports = {
  apps: [
    {
      name: 'Proxy',
      script: './src/proxy.js',
      exec_mode: 'cluster',
      watch: true,
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
    },
    {
      name: 'Hello World',
      script: './src/services/helloWorld/index.js',
      exec_mode: 'cluster',
      watch: true,
      env: {
        PORT: 8000,
        NODE_ENV: 'development',
      },
    },
    {
      name: 'Status Codes',
      script: './src/services/codes/index.js',
      exec_mode: 'cluster',
      watch: true,
      env: {
        PORT: 8002,
        LOG_LEVEL: 'debug',
        NODE_ENV: 'development',
      },
    },
    {
      name: 'Get Fixtures',
      script: './src/services/getFixtures/index.js',
      exec_mode: 'cluster',
      watch: true,
      env: {
        PORT: 8001,
        API_TOKEN: 'c1f33647715444d5897b249e5245c56d',
        API_BASE: "http://toxiproxy:9000/v1",
        COMPETITION_ID: 467,
        LOG_LEVEL: 'debug',
        NODE_ENV: 'development',
        TIMEOUT: 1000,
      },
    },
  ],
};
