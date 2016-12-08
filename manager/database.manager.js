'use strict';

function DatabaseManager() {
  let self = this;

  self.get = get;
  self.set = set;
  self.databases = global.db;

  function get(dbname) {
    return self.databases[dbname];
  }

  function set(dbname, db) {
    self.databases[dbname] = db;
  }
}

module.exports = DatabaseManager;
