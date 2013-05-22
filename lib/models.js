var persist = require('persist'),
    dbConnector = require('db-connect'),
    fs = require('fs'),
    path = require('path'),
    async = require('async');

exports.define = function(name, columnDefs, opts) {
  var Model = persist.define(name, columnDefs, opts),
      methodName;

  if (opts.classMethods) {
    for (methodName in opts.classMethods) {
      if (Model[methodName] !== undefined) {
        throw new Error("'" + methodName + "' is already exists in " + name + " Model.");
      }
      Model[methodName] = opts.classMethods[methodName];
    }
  }
  if (opts.instanceMethods) {
    for (methodName in opts.instanceMethods) {
      Model.prototype[methodName] = opts.instanceMethods[methodName];
    }
  }
  return Model;
};

exports.defineAuto = function(name, opts, callback) {
  dbConnector.connect(function(err, conn) {
    if (err) {
      return callback(err);
    }
    var methodName,
        options = opts || {};

    options.driver = conn.opts.driver;
    options.db = conn.db;

    persist.defineAuto(name, options, function(err, Model) {
      conn.close();
      if (err) {
        return callback(err);
      }
      if (opts.classMethods) {
        for (methodName in opts.classMethods) {
          if (Model[methodName] !== undefined) {
            throw new Error("'" + methodName + "' is already exists in " + name + " Model.");
          }
          Model[methodName] = opts.classMethods[methodName];
        }
      }
      if (opts.instanceMethods) {
        for (methodName in opts.instanceMethods) {
          Model.prototype[methodName] = opts.instanceMethods[methodName];
        }
      }
      callback(null, Model);
    });
  });
};

exports.requireModel = function(modelName) {
  return require('../models/' + modelName).requireModel();
};

exports.defineAllModels = function(callback) {
  var modelFilesName = fs.readdirSync(path.join(__dirname, '../models'));
  async.each(modelFilesName, function(modelFileName, next) {
    require('../models/' + modelFileName).defineModel(next);
  },
  function(err) {
    callback(err);
  });
};
