'use strict';

const _      = require('lodash');
const fs     = require('fs');
const yaml   = require('js-yaml');
const path   = require('path');
const colors = require('colors');

function ComponentsLoader(appPath) {
  let self = this;

  function init() {
    self.appPath = appPath;
    self.componentPrefix = path.join(self.appPath, '/components/');
  }

  init();

  /// Attributes
  ///////

  self.components = {};
  self.globalLoadingError = false;

  /// Public Methods
  ///////

  self.load = load;

  function load(components) {
    let componentsMessage = [
      '* Kernel: Load Components',
      '***************************\n'
    ].join('\n');

    console.log(componentsMessage);
    console.log('Components:');

    _.forEach(components, (component) => {
      self.components[component] = getComponent(component);
    });

    return [self.components, self.globalLoadingError];
  }

  /// Private Methods
  ///////

  function getComponent(component) {
    let routes;

    let componentMessage = [
      '- ',
      component,
      ' ',
    ];

    try {
      let path = getRoutePath(component);
      let file = fs.readFileSync(path, 'utf8');
      routes = yaml.safeLoad(file);
    } catch (e) {
      componentMessage.push('ERROR'.red);
      console.log(componentMessage.join(''));
      routes = false;
      self.globalLoadingError = true;
    }

    if (routes) {
      componentMessage.push('OK'.green);
      console.log(componentMessage.join(''));
      return routes;
    }
  }

  function getRoutePath(component) {
    return [
      self.componentPrefix,
      component,
      '/',
      component,
      '.routes.yml'
    ].join('');
  }
}

module.exports = ComponentsLoader;
