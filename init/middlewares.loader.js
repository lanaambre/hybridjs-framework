'use strict';

const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const colors = require('colors');

function MiddlewaresLoader() {
  let self = this;

  function init() {
    self.globalPrefix = '/../../app/common/middlewares/';
    self.globalSuffix = '.middleware';
    self.error = 0;
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
