/* eslint one-var: 0 */

'use strict';

process.title = process.argv[2] || 'blogApp';

const serverLogger = require('./log-manager').getRootLogger(__filename);

process.on('exit', () => {
  serverLogger.warn('Exiting from the main server process.');
});

process.on('uncaughtException', (err) => {
  serverLogger.info(err);
  process.exit(255);
});

const loopback = require('loopback'),
      boot     = require('loopback-boot'),
      path     = require('path');

var app = module.exports = loopback();

const lbConfigRootDir    = path.resolve(__dirname, 'config/lb'),
      lbCommonBootDir    = path.resolve(__dirname, 'boot'),
      lbMainAppServerDir = path.resolve(__dirname, '../server');

const getSortedScriptFiles = require('./utils/helpers')
  .getSortedScriptFiles([
    lbCommonBootDir,
    path.resolve(lbMainAppServerDir, 'boot')
  ]);

let appCategory = require('./utils/helpers').getAppCategory(); //blog|spydr|config

(async function getConfigs () {
  return {
    appRootDir: lbMainAppServerDir,
    config: await require('./config/lb/get-config')(),
    dsRootDir: lbConfigRootDir,
    middlewareRootDir: lbConfigRootDir,
    middleware: await require('./config/lb/get-middleware')(appCategory),
    componentRootDir: lbConfigRootDir,
    bootScripts: getSortedScriptFiles
  };
})().then(function(configLocations) {
  app.set('restApiRoot', `/${appCategory}/api`);
  // Bootstrap the application, configure models, datasources and middleware.
  // Sub-apps like REST API are mounted via boot scripts.
  boot(app, configLocations, function (err) {
    if (err) {
      serverLogger.fatal('Error in bootstrapping application configurations.', err);
      throw err;
    }
    app.start = function () {
      let appPort = parseInt(app.get('apps')[appCategory].port, 10) || 3000;
      // start the web server
      return app.listen(appPort, function () {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        serverLogger.warn('Web server listening at: ', baseUrl);
        if (app.get('loopback-component-explorer')) {
          let explorerPath = app.get('loopback-component-explorer').mountPath;
          serverLogger.warn('Browse your REST API at: ', baseUrl + explorerPath);
        }
      });
    };
    // start the server if `$ node server.js`
    if (require.main === module) {
      app.start();
    }
  });
}, function (reject) {
  serverLogger.error('reject: ', reject);
}).catch(function(catchError) {
  serverLogger.error('catchError', catchError);
});
