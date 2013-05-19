var STATUS_ACTIVE = 1,
    persist = require('persist'),
    type = persist.type,
    crypto = require('crypto'),
    models = require('models'),
    dbConnector = require('db-connect'),
    User;

exports.requireModel = function() {
  return User;
};

exports.defineModel = function(next) {
  models.defineAuto('user', {
    classMethods: {
      hashPassword: function(clearPassword) {
        var shasum = crypto.createHash('sha1');
        shasum.update(clearPassword);
        return shasum.digest('hex');
      },
      tryToLogin: function(login, password, callback) {
        dbConnector.connect(function(err, conn) {
          if (err) {
            return callback(err);
          }
          User.where({'login': login}).first(conn, function(err, user) {
            // FIXME closeコールの基盤対応
            conn.close();
            if (err) {
              return callback(err);
            }
            if (user && user.active() && user.verifyPassword(password)) {
              return callback(null, user);
            }
            return callback(null);
          });
        });
      }
    },
    instanceMethods: {
      active: function() {
        return this.status === STATUS_ACTIVE;
      },
      verifyPassword: function(clearPassword) {
        return User.hashPassword(this.salt + User.hashPassword(clearPassword)) === this.hashed_password;
      }
    }
  },
  function(err, UserModel) {
    User = UserModel;
    next(err);
  });
};
