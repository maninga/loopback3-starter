'use strict';

//var app = require('../../srvcommon/server');

module.exports = function () {
  return function dummyAppSpecificMiddleware(req, res, next) {
    res.send('nice');
  };
};
