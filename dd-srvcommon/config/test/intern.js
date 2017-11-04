'use strict';

define(function (require) {
  //'use strict';

  const path                     = require('intern/dojo/node!path'),
        fs                       = require('intern/dojo/node!fs'),
        debug                    = require('intern/dojo/node!debug')('srvcommon:load-intern-configs'),
        commonInternConfigs      = require('intern/dojo/node!./common-intern-configs');

  //debug('commonInternConfigs', commonInternConfigs);

  var completeInternConfigs = commonInternConfigs;

  completeInternConfigs.suites = completeInternConfigs.suites || [];
  completeInternConfigs.functionalSuites = completeInternConfigs.functionalSuites || [];

  if (fs.existsSync(path.resolve('../tests/app-intern-configs.js'))) {
    let resolvePathToMainApp = function (v) {
      //FIXME - Be careful, global.__dirname is not available here
      return path.resolve('../', v);
    };

    let appSpecificInternConfigs = require('intern/dojo/node!../../../tests/app-intern-configs');

    //debug('appSpecificInternConfigs', appSpecificInternConfigs);

    completeInternConfigs.suites =
      completeInternConfigs.suites.concat(
        appSpecificInternConfigs.suites.map(resolvePathToMainApp));

    completeInternConfigs.functionalSuites =
      completeInternConfigs.functionalSuites.concat(
        appSpecificInternConfigs.functionalSuites.map(resolvePathToMainApp));
  }

  debug('completeInternConfigs:', completeInternConfigs);

  return completeInternConfigs;
});
