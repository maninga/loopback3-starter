'use strict';

const path = require('path'),
      fs = require('fs'),
      destDir = path.resolve(__dirname, '../../common/models'),
      loopback = require('loopback'),
      connectorName = 'postgresql',
      ds = loopback.createDataSource(connectorName, {
        host: 'ob.dd.com',
        port: 5432,
        database: 'db',
        username: 'admin',
        password: 'some-secret'
      }),
      schemaName = 'ob',
      modelConfigFilePath = path.resolve(__dirname, '../../server/model-config.json');

var modelConfigJSON = require(modelConfigFilePath);

ds.discoverModelDefinitions({schema: schemaName, views: true},
  function (err, modelDefs) {
    if (err || !modelDefs) {
      throw new Error('no tables found', err);
    }
    if (modelDefs instanceof Array) {
      let modelsProcessedCount = 0;
      modelDefs.forEach(function (v) {
        if (v.type === 'table') {
          ds.discoverSchema(v.name, {schema: schemaName, relations: true},
            function (err, schema) {
              if (err || !schema) {
                throw new Error(
                  `no schema found for the table: ${v.name}`, err);
              }

              //TODO - Ashwini - Remove the pg schema_search_path
              /*if(schema.options && schema.options[connectorName] &&
               schema.options[connectorName].schema) {
               delete schema.options[connectorName].schema;
               }*/

              let destFileName = `${destDir}/${schema.name}.json`;
              fs.writeFile(destFileName,
                JSON.stringify(schema, null, 2), function (err) {
                  if (err) {
                    //debug(err);
                  } else {
                    modelConfigJSON[schema.name] = {
                      dataSource: 'ddDB',
                      'public': true
                    };
                    modelsProcessedCount++;
                    //debug(`model '${v.name}' ready!`);
                    //console.info(modelsProcessedCount, modelDefs.length);
                    if (modelsProcessedCount === modelDefs.length) {
                      fs.writeFile(modelConfigFilePath,
                        JSON.stringify(modelConfigJSON, null, 2), function (err) {
                          if (err) {
                            //debug(err);
                          } else {
                            //debug('!!All Done!!');
                            process.exit(0);
                          }
                        });
                    }
                  }
                });
            });
        } else if (v.type === 'view') {
          modelsProcessedCount++;
          //debug(`An artificial view: '${v.name}' ;-)`);
        }
      });
    }
  }
);
