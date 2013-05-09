var persist = require('persist');

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

exports.defineAuto = function(name, options, callback) {
  persist.defineAuto(name, options, function(err, Model) {
    if (options.instanceMethods) {
      for (var methodName in options.instanceMethods) {
        Model.prototype[methodName] = options.instanceMethods[methodName];
      }
    }
    callback(null, Model);
  });
};

exports.requireModel = function(modelName) {
  return require('../models/' + modelName);
};
