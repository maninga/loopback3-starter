'use strict';

const isAPIExplorerEnabled = global.finalAppConfigs.enableAPIExplorer;

if (isAPIExplorerEnabled === true) {
  module.exports = exports = {
    'loopback-component-explorer': {
      mountPath: '/explorer'
    }
  };
} else {
  module.exports = exports = {
    'loopback-component-explorer': false
  };
}
