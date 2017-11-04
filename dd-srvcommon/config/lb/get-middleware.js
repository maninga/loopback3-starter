'use strict';
const path = require('path'),
      boot = require('loopback-boot');

let middlewaresConfigCache = require('./middleware.json'),
    mainAppRootDir = path.resolve(__dirname, '../../..'),
    dirToLoadMiddlewareFrom = path.resolve(mainAppRootDir, 'server'),
    appSpecificMiddlewares = boot.ConfigLoader.loadMiddleware(dirToLoadMiddlewareFrom) || {};

let appRoutesKeys = Object.keys(appSpecificMiddlewares.routes || {});
//Translating app routes keys relative to loading path
if (appRoutesKeys.length !== 0) {
  let transformedRoutes = {};

  for (let n = 0, l = appRoutesKeys.length; n < l; n++) {
    let key = appRoutesKeys[n],
        transformedKey = key;

    if (key.indexOf('./') === 0 || key.indexOf('../') === 0) {
      // Relative path
      let currRouteAbsolutePath = path.resolve(dirToLoadMiddlewareFrom, key);
      transformedKey = path.relative(__dirname, currRouteAbsolutePath);
    }
    transformedRoutes[transformedKey] = appSpecificMiddlewares.routes[key];
  }
  delete appSpecificMiddlewares.routes;
  appSpecificMiddlewares.routes = transformedRoutes;
}

middlewaresConfigCache.routes = middlewaresConfigCache.routes || {};

module.exports = async function (appCategory) {
  let completeMWConfigs = JSON.parse(JSON.stringify(middlewaresConfigCache));

  for (let route in appSpecificMiddlewares.routes) {
    if (appSpecificMiddlewares.routes.hasOwnProperty(route)) {
      completeMWConfigs.routes[route] = appSpecificMiddlewares.routes[route];
      completeMWConfigs.routes[route].paths = '/' + appCategory + completeMWConfigs.routes[route].paths;
    }
  }

  // Override from some external service, if required based on env values

  return completeMWConfigs;
};
