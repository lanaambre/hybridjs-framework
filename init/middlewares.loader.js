'use strict';

const _      = require('lodash');
const fs     = require('fs');
const yaml   = require('js-yaml');
const path   = require('path');
const colors = require('colors');

function MiddlewaresLoader(appPath) {
  let self = this;

  function init() {
    self.error        = 0;
    self.appPath      = appPath;
    self.globalPrefix = path.join(self.appPath, '/common/middlewares/');
    self.globalSuffix = '.middleware';
  }

  init();

  /// Public Methods
  ///////

  self.global = global;

  function global(app, middlewares) {
    _.forEach(middlewares, (middleware) => {
      let middlewareLoaded = load(middleware);

      if (middlewareLoaded) {
        app.use(middlewareLoaded);
      } else {
        console.log('Bad bad');
        self.error++;
      }
    });

    return !self.error;
  }

  /// Private Methods
  ///////

  function load(middleware) {
    try {
      let path = buildPath(middleware);
      return require(path);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  function buildPath(middleware) {
    return __dirname + self.globalPrefix + middleware + self.globalSuffix;
  }
}

module.exports = MiddlewaresLoader;
