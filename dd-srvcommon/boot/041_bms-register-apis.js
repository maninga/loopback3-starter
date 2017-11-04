'use strict';

module.exports = function registerApis(app) {
  const appCategory = require('../utils/helpers').getAppCategory(),
        ENABLE_AUTH = app.get('enableAuth'),
        contextRoot = '/' + appCategory,
        appConfigs = app.get('apps')[appCategory],
        restApiRoot = appConfigs.restApiRoot,
        middlewareApiRoot = appConfigs.middlewareApiRoot;

  if (ENABLE_AUTH === false || ENABLE_AUTH === 'false') {
    app.use(restApiRoot, [app.loopback.rest()]);

    app.use(middlewareApiRoot, [function (req, res, next) {
      next();
    }]);
  } else {
    const Keycloak = require('@dd/keycloak-connect'),
          Protect = require('./../utils/protect'),
          URL = require('url');

    Keycloak.prototype.protect = function (spec) {
      return Protect(this, spec);
    };

    const keycloak = new Keycloak({
      store: global.sessionStore
    }, app.get('keycloak'));

    app.use(keycloak.middleware({
      logout: `${contextRoot}/rapi/logout`,
      admin: '/'
    }));

    // super protected resources like ratehurdles, seasons etc
    app.delete([`/${restApiRoot}/cinema`],
      keycloak.protect('ddAdmin'), app.loopback.rest());

    app.use(restApiRoot, keycloak.protect(), app.loopback.rest());

    /*app.use(restApiRoot, keycloak.protect(), Firewall({
     blockedOrigins: ''
     }), app.loopback.rest());*/

    app.use(middlewareApiRoot, keycloak.protect(), function (req, res, next) {
      next();
    });
  }
};
