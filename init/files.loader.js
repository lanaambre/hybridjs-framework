'use strict';

const fs = require('fs');

function FilesLoader() {
  let self = this;

  function init() {
    self.libPrefix = __dirname + '/../lib/';
    self.commonPrefix = __dirname + '/../../app/common/';
    self.componentsPrefix = __dirname + '/../../app/components/';
  }

  init();

  /// Public Methods
  ///////

  self.middleware = middleware;
  self.validation = validation;
  self.componentToLib = componentToLib;
  self.commonToLib = commonToLib;
  self.lib = lib;

  function middleware(name, component = false, strict = false) {
    if (component) {
      return self.componentToLib(component, 'middlewares', name);
    } else if (!strict) {
      return self.commonToLib('middlewares', name);
    } else {
      return false;
    }
  }

  function validation(name, component = false, strict = false) {
    if (component) {
      return self.componentToLib(component, 'validations', name);
    } else if (!strict) {
      return self.commonToLib('validations', name);
    } else {
      return false;
    }
  }

  function componentToLib(component, type, name) {
    let prefix = [self.componentsPrefix, component, ''].join('/');
    let path = buildPath(prefix, type, name);

    if (isFile(path)) {
      return requireFile(path);
    }

    return self.commonToLib(type, name);
  }

  function commonToLib(type, name) {
    let path = buildPath(self.commonPrefix, type, name);

    if (isFile(path)) {
      return requireFile(path);
    }

    return self.lib(type, name);
  }

  function lib(type, name) {
    let path = buildPath(self.libPrefix, type, name);

    if (isFile(path)) {
      return requireFile(path);
    }

    return false;
  }

  /// Private Methods
  ///////

  function buildPath(prefix, type, name) {
    let typeSingle = type.replace(/s\s*$/, '');
    return prefix + type + '/' + name + '.' + typeSingle + '.js';
  }

  function isFile(path) {
    try {
      return fs.statSync(path).isFile();
    } catch (e) {
      if (e.code === 'ENOENT') {
        return false;
      } else {
        throw e;
      }
    }
  }

  function requireFile(path) {
    return require(path);
  }
}

module.exports = FilesLoader;
