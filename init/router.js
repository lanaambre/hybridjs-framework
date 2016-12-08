'use strict';

const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const colors = require('colors');
const FilesLoader = require('./files.loader.js');

function Router(app, components, secret) {
  let self = this;

  function init() {
    self.app = app;
    self.components = components;
    self.secret = secret;
    console.log('secret', secret);
    self.componentPrefix = __dirname + '/../../app/components/';

    self.loadedControllers = {};
    self.loadedMiddlewares = [];
    self.loadedComponentMiddlewares = {};

    self.success = 0;
    self.error = 0;

    self.loader = new FilesLoader();
  }

  init();

  /// Public Methods
  ///////

  self.generate = generate;

  function generate() {
    let routerMessage = [
      '* Kernel: Generate application',
      '********************************'
    ].join('\n');

    console.log('');
    console.log(routerMessage);

    _.forEach(self.components, (routes, component) => {
      generateRoutes(component, routes);
    });

    let resumeMessage = [
      '\nRoutes generation: ',
      self.success.toString().green,
      ' SUCCESS'.green,
    ];

    if (self.error) {
      resumeMessage.push(' - ');
      resumeMessage.push(self.error.toString().red + ' ERROR'.red);
    }

    console.log(resumeMessage.join(''));

    return !self.error;
  }

  /// Private Methods
  ///////

  function generateRoutes(component, routes) {
    _.forEach(routes, (route, action) => {
      let controller = getController(component, route.controller);
      let middlewares = getMiddlewares(component, route.middlewares);

      console.log('\n' + route.path);

      _.forEach(route.method, (method) => {
        let appMethod = httpMethod(method);
        let ctrlMethod = controllerMethod(action, method);

        if (_.isFunction(controller[ctrlMethod])) {
          console.log('middlewares', middlewares);
          let args = _.concat([route.path], middlewares, controller[ctrlMethod]);
          self.app[appMethod].apply(self.app, args);
          self.success++;
          console.log('- ' + method + ' OK'.green);
        } else {
          self.error++;

          let errorMessage = [
            '- ',
            method,
            ' ERROR '.red,
            ctrlMethod.red,
            ' is not define in '.red,
            route.controller.red
          ].join('');

          console.log(errorMessage);
        }
      });
    });
  }

  function controllerMethod(action, method) {
    return method.toLowerCase() + action;
  }

  function httpMethod(method) {
    let httpMethod = method;

    if (method == 'PATCH' || method == 'UPDATE') {
      httpMethod = 'PUT';
    }

    return httpMethod.toLowerCase();
  }

  function getController(component, controller) {
    if (_.isUndefined(self.loadedControllers[controller])) {
      let controllerFormat = controller.slice(0, -10).toLowerCase();

      let controllerPath = [
        self.componentPrefix,
        component,
        '/',
        controllerFormat,
        '.controller.js'
      ].join('');

      let LoadController = require(controllerPath);
      self.loadedControllers[controller] = new LoadController();
    }

    return self.loadedControllers[controller];
  }

  function getMiddlewares(component, middlewares) {
    let middlewaresLoaded = [];

    if (_.isUndefined(self.loadedMiddlewares[component])) {
      self.loadedMiddlewares[component] = {};
    }

    _.forEach(middlewares, (middleware) => {
      middlewaresLoaded.push(loadMiddleware(component, middleware));
    });

    return middlewaresLoaded;
  }

  function loadMiddleware(component, middleware) {
    if (_.isUndefined(self.loadedMiddlewares[component][middleware])) {
      let middlewareLow = middleware.toLowerCase();
      let middlewareLoaded = self.loader.middleware(middlewareLow, component);
      self.loadedMiddlewares[component][middleware] = middlewareLoaded;
    }

    return self.loadedMiddlewares[component][middleware];
  }
}

module.exports = Router;
