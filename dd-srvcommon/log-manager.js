/* eslint one-var: 0 */
/* eslint no-console: 0 */

'use strict';

const chalk = require('chalk');

let getConsoleLogger = function (fileName) {
  const cSeperator = chalk.bold('||');
  const cFileName = chalk.blue(fileName.split('/').pop());

  var consolePlaceHolder = function (logCategory) {
    var cColor = null;

    switch (logCategory) {
      case 'trace':
      case 'debug':
      case 'info':
        cColor = 'gray';
        break;
      case 'warn':
      case 'error':
      case 'fatal':
        cColor = 'red';
        break;
      default:
        cColor = 'gray';
        break;
    }

    const cLogCategory = chalk[cColor](logCategory.toUpperCase());
    return function (firstArg) {
      if (firstArg) {
        console.info.apply(null,
          [chalk.yellow((new Date()).toISOString()) + cSeperator +
          cFileName + cSeperator +
          cLogCategory + cSeperator]
            .concat(Array.prototype.slice.call(arguments)));
      }
    };
  };
  return {
    fatal: consolePlaceHolder('fatal'),
    error: consolePlaceHolder('error'),
    warn: consolePlaceHolder('warn'),
    info: consolePlaceHolder('info'),
    debug: consolePlaceHolder('debug'),
    trace: consolePlaceHolder('trace')
  };
};

module.exports = {
  getLogger: getConsoleLogger,
  getRootLogger: getConsoleLogger
};
