var fs = require('fs'),
    path = require('path'),
    config = require('config'),
    persist = require('persist');

var loadDatabaseJson = function(pathStr) {
  var databaseJson = JSON.parse(fs.readFileSync(pathStr).toString());
  var env = process.env.NODE_ENV || databaseJson['default'];
  var opts = databaseJson[env];
  opts.sqlDir = path.join(path.dirname(pathStr), opts.sqlDir || 'sql');
  persist.setDefaultConnectOptions(opts);
};

var tryLoadDatabaseJson = function() {
  var path = 'config/database.json';
  try {
    var stats = fs.statSync(path);
    if (stats) {
      loadDatabaseJson(path);
    }
  } catch (e) {
    throw e;
  }
}();

exports.connect = function(callback) {
  persist.connect(function(err, connection) {
    if (err) {
      return callback(err);
    }
    callback(null, connection);
  });
};
