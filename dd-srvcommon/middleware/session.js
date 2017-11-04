/**
 * Setup the session object
 */

'use strict';

module.exports = function (options) {
  var session = require('express-session'),
      uid = require('uid-safe').sync;
  if (options && options.store) {
    let store = options.store;
    delete options.store;
    if (store.module) {
      let SessStore = require(store.module)(session),
          storeParams = store.params;
      options.store = new SessStore(storeParams);
      global.sessionStore = options.store;
    }
  }
  if (!global.sessionStore) {
    global.sessionStore = new session.MemoryStore();
  }
  options.genid = function (req) {
    if (req.sessionID) {
      return req.sessionID;
    }
    return uid(24);
  };
  return session(options);
};
