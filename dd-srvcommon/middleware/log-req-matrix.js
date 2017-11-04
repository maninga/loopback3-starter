/**
 *
 * Setup middleware for logging request logging processing
 */

'use strict';

const reqMatrixLogger = require('../log-manager').getRootLogger(__filename);

module.exports = function() {
  return function logReqMatrix(req, res, next) {
    var start = process.hrtime();
    res.once('finish', function() {
      var diff = process.hrtime(start),
          ms = diff[0] * 1e3 + diff[1] * 1e-6;

      //reqMatrixLogger.info(`The request processing time for url: ${decodeURIComponent(req.url)} is ${ms} ms.`);
    });
    next();
  };
};
