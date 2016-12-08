'use strict';

const program = require('commander');

const options = function(rawConfig) {
  program
    .version('0.0.1')
    .option('-p, --port [port]', 'Choose a port for your application', rawConfig.app.port)
    .option('-e, --env [env]', 'Choose an environment for your application', rawConfig.app.environment)
    .parse(process.argv);

  let config = rawConfig;

  config.app.port = program.port;
  config.app.environment = program.env;

  return config;
};

module.exports = options;
