'use strict';

const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const colors = require('colors');

function ComponentsLoader() {
  let self = this;

  function init() {
    // Do Something
  }

  init();

  /// Attributes
  ///////

  self.components = {__error: false};
  self.componentPrefix = __dirname + '/../../app/components/';

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

    return self.components;
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
      self.components.__error = true;
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
