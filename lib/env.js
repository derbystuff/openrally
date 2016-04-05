const ENV_LOOKUP = {
  development: 'dev',
  production: 'prd',
  prod: 'prd',
  stage: 'stg',
};
const ENV = ENV_LOOKUP[process.env.NODE_ENV]||'dev';

module.exports = ENV;
