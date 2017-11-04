/**
 *
 * Setup middleware for healthchecks
 */

'use strict';
module.exports = function () {
  return function healthcheck(req, res, next) {
    if (req.method === 'HEAD' && (req.url === '/' || req.url === '/health')) {
      return res.sendStatus(200);
    }
    next();
  };
};
