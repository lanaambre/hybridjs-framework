'use strict';

function testMiddleware(req, res, next) {
  console.log('libTestMiddleware');
  next();
}

module.exports = testMiddleware;
