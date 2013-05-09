var models = require('models'),
    dbConnector = require('db-connect'),
    should = require('should'),
    async = require('async'),
    domain = require('domain');

require('js-yaml');

var loadFixture = exports.loadFixture = function(modelName) {
  return require('../db/fixture/' + modelName + '.yml');
};

var setupFixture = exports.setupFixture = function(modelNames) {
  var modelNameArray = [].concat(modelNames),
      d = domain.create();

  return function(done) {
    dbConnector.connect(function(err, conn) {
      should.not.exist(err);
      conn.tx(function(err, tx) {
        should.not.exist(err);

        d.on('error', function(err) {
          tx.rollback(function(rollbackErr) {
            conn.close();
            should.not.exist(err);  
          });
        });

        async.concatSeries(modelNameArray, function(modelName, next) {
          var Model = models.requireModel(modelName);
          Model.deleteAll(conn, function(err) {
            var data = [],
                records = [].concat(loadFixture(modelName));
            records.forEach(function(record) {
              data.push(new Model(record));
            });
            next(err, data);
          });
        },
        d.intercept(function(results) {
          conn.save(results, d.intercept(function() {
            tx.commit(function(err) {
              conn.close();
              done();
            });
          }));
        }));
      });
    });
  };
};

exports.setupCommonData = function() {
  return setupFixture('user');
};
