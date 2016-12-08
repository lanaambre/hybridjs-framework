'use strict';

const yaml = require('js-yaml');
const fs   = require('fs');

function loadConfig(appFolder) {
  try {
    return yaml.safeLoad(
      fs.readFileSync(appFolder + '/app.yml', 'utf8')
      );
  } catch (e) {
    console.log(e);
    return false;
  }

  return files;
};

module.exports = loadConfig;
