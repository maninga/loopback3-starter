'use strict';

module.exports = function (specs) {
  return function firewall (request, response, next) {
    //https://www.w3.org/TR/cors/#{resource-requests,resource-security,resource-implementation}
    //console.info('firewall:: request.headers: ', request.headers);
    next();
  };
};
