var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var STATUS_ACTIVE = 1;

  var User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true},
    login: DataTypes.STRING,
    hashed_password: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    mail: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    status: DataTypes.INTEGER,
    created_on: DataTypes.DATE,
    updated_on: DataTypes.DATE,
    salt: DataTypes.STRING
  }, {
    timestamps: false,
    underscored: true,
    classMethods: {
      hashPassword: function(clearPassword) {
        var shasum = crypto.createHash('sha1');
        shasum.update(clearPassword);
        return shasum.digest('hex');
      },
      tryToLogin: function(login, password, callback) {
        User.find({where: {login: login}}).done(function(err, user) {
          if (err) {
            callback(err);
            return;
          }          
          if (user && user.active && user.verifyPassword(password)) {
            callback(null, user);
            return;
          }
          callback(null);
          return;
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
  });
  return User;
};
