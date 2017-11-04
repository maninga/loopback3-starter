'use strict';
const _ = require('lodash');

let completeConfigsCache = require('./config.json'),
    localConfigsCache = null;

try {
  localConfigsCache = require('./config.local.json');
} catch (error) {
  localConfigsCache = {};
}

_.merge(completeConfigsCache, localConfigsCache);

module.exports = async function () {
  let completeConfigs = JSON.parse(JSON.stringify(completeConfigsCache));

  // Override from some external service, if required based on env values

  for (let ck in completeConfigs.apps.common) {
    for (let ak in completeConfigs.apps) {
      completeConfigs.apps[ak][ck] = completeConfigs.apps[ak][ck] || completeConfigs.apps.common[ck];
    }
  }

  completeConfigs.dbConf.password = process.env.PGPASSWORD || 'pgadmin123';

  global.finalAppConfigs = completeConfigs;
  return completeConfigs;
};
