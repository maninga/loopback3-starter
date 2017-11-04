'use strict';

const path = require('path'),
      fs = require('fs');

let getScriptsByDir = function (dir) {
  let tryReadDir = function () {
    try {
      return fs.readdirSync.apply(fs, arguments);
    } catch (e) {
      return [];
    }
  };
  let files = tryReadDir(dir);
  let results = [];

  files.forEach(function (filename) {
    let filepath = path.resolve(path.join(dir, filename));
    let stats = fs.statSync(filepath);
    if (stats.isFile()) {
      let ext = path.extname(filename);
      if (ext === '.js') {
        results.push(filepath);
      } else {
        //debug('Skipping file %s - unknown extension', filepath);
      }
    } else {
      //debug('Skipping directory %s', filepath);
    }
  });
  return results;
};

let getSortedScripts = function (dirs) {
  let filePaths = [];
  if ('string' === typeof dirs) {
    filePaths = filePaths.concat(getScriptsByDir(dirs));
  } else if (dirs instanceof Array) {
    dirs.forEach(function (dir) {
      filePaths = filePaths.concat(getScriptsByDir(dir));
    });
  }
  // sort filePaths in lowercase alpha for linux
  filePaths.sort(function (a, b) {
    a = path.basename(a);
    b = path.basename(b);
    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a < b) {
      return -1;
    } else if (b < a) {
      return 1;
    }
    return 0;
  });
  return filePaths;
};

let getAppCategory = function () {
  const appFullName = require('./../../package.json').name;
  if ('string' === typeof appFullName) {
    return appFullName.toLowerCase().replace('dd', '');
  }
  return null;
};

module.exports = {
  getSortedScriptFiles: getSortedScripts,
  getAppCategory: getAppCategory
};
