'use strict';

// Require npm dependencies
const bodyParser          = require('body-parser');
const colors              = require('colors');
const express             = require('express');
const http                = require('http');
const morgan              = require('morgan');

// Require file dependencies
const ComponentsLoader    = require('./init/components.loader');
const MiddlewaresLoader   = require('./init/middlewares.loader');
const Router              = require('./init/router');
const reqLoggerMiddleware = require('./tools/req.logger.middleware.js');

// Kernel class
function Kernel(config) {
  let self = this;

  function init() {
    self.config = config;
    self.app = express();
    self.server = http.Server(self.app);

    // Config App, and load dependencies
    configApp();
    dependencies();
  }

  init();

  /// Private Methods
  ///////

  function configApp() {
    // Define static folder
    self.app.use(morgan('dev'));
    self.app.use(express.static(__dirname + '/../public'));
    self.app.use(bodyParser.urlencoded({extended: false}));
    self.app.use(bodyParser.json());
  }

  function dependencies() {
    let middlewaresConfig = self.config.dependencies.middlewares;

    // Initialize global middlewares
    let middlewaresLoader = new MiddlewaresLoader;
    let middlewaresOk = middlewaresLoader.global(self.app, middlewaresConfig);

    if (!middlewaresOk) {
      console.log('\nError during global middlewares loading'.red);
      return;
    }

    // Load components
    let componentsConfig = self.config.dependencies.components;
    const componentsLoader = new ComponentsLoader();
    let components = componentsLoader.load(componentsConfig);

    if (components.__error) {
      console.log('\nError during components loading'.red);
      return;
    }

    delete components.__error;

    // Init Routes and then launch server
    const router = new Router(self.app, components, self.config.app.secret);
    let appIsLoad = router.generate();

    // Launch Server
    if (appIsLoad) {
      launchServer();
    } else {
      console.log('Fail to start app - Please fix routes issues before loading'.yellow);
      return;
    }
  }

  function launchServer() {
    let serverConfig = self.config.app;

    self.server.listen(serverConfig.port, function() {
      let message = [
        `\n${serverConfig.name} is launch\n`.green,
        `Listening on port ${serverConfig.port}, `,
        `on ${serverConfig.environment} environment.`,
      ].join('');

      console.log(message);
    });
  }
}

module.exports = Kernel;
