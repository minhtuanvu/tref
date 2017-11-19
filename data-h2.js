// Data access from H2 throuh jdbc

var jdbc = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var stringify = require('node-stringify');

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./drivers/h2-1.3.161.jar']);
};

var config = {
  url: 'jdbc:h2:tcp://localhost:3456/TAFJDB',
  drivername: 'org.h2.Driver',
  minpoolsize: 10,
  maxpoolsize: 100,
  properties:{
    user: 't24',
    password: 't24'
  }
};

var h2db = new jdbc(config);
h2db.initialize(function(err) {
  if (err) {
    console.log(err);
  }
});

var parse = function(err, result) {

}

module.exports = {
    rs: function(appName, rsCallback) {
      var asyncjs = require('async');
      h2db.reserve(function(err, connObj) {
        if (connObj) {
          console.log('Using connection: ' + connObj.uuid);
          var conn = connObj.conn;
          asyncjs.series([
            function(callback) {
              conn.setAutoCommit(false, function(err) {
                if (err) {
                  callback(err);
                } else {
                  callback(null, conn);
                }
              });
            },
            function(callback) {
              conn.createStatement(function(err, statement) {
                if (err) {
                  callback(err);
                } else {
                  statement.setFetchSize(100, function(err) {
                    if (err) {
                      callback(err);
                    } else {
                      statement.executeQuery("SELECT * FROM F_STANDARD_SELECTION WHERE RECID = '" + appName + "';",
                        function(err, resultset) {
                          if (err) {
                            callback(err)
                          } else {
                            resultset.toObjArray(function(err, results) {
                              if (results.length > 0) {
                                callback(null, results);
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            ],
            function(err, results) {
              h2db.release(connObj, function(err) {
                if (err) {
                  console.log(err.message);
                } else {
                  console.log('Connection released back to pool ' + connObj.uuid)
                }
              });
              rsCallback(null, results);
            })
          }
        })
      }
    }
