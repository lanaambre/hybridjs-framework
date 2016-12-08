'use strict';

function reqLoggerMiddleware(req, res, next) {
  console.log('reqLoggerMiddleware');
  res.on('finish', function() {
    console.log('res finish');
  });

  next();
}

module.exports = reqLoggerMiddleware;
