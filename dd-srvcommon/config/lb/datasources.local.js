'use strict';

const path = require('path'),
      completeAppConfigs = global.finalAppConfigs,
      dbConf = completeAppConfigs.dbConf;

if (dbConf && 'object' === typeof dbConf) {
  //exports.ddDB = dbConf;
}