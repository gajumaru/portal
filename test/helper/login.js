var config = require('config'),
    dbConnector = require('db-connect'),
    should = require('should'),
    urlHelper = require('./url');

exports.setUpValidUser = function(recreate) {
  var redmineDB = dbConnector.connectRedmine();
  var User = redmineDB.loadEntity('user');
  var force = recreate === undefined ? true : recreate;
  return function(done) {
    User.sync({force: force}).done(function(err) {
      should.not.exist(err);
      User
        .build({
          login: config.validUser.login,
          hashed_password: config.validUser.hashedPassword,
          status: config.validUser.status,
          salt: config.validUser.salt
        }).save().done(function(err) {
          should.not.exist(err);
          done();
        });
    });
  };
};

exports.setUpLockedUser = function(recreate) {
  var redmineDB = dbConnector.connectRedmine();
  var User = redmineDB.loadEntity('user');
  var force = recreate === undefined ? true : recreate;
  return function(done) {
    User.sync({force: force}).done(function(err) {
      should.not.exist(err);
      User
        .build({
          login: config.lockedUser.login,
          hashed_password: config.lockedUser.hashedPassword,
          status: config.lockedUser.status,
          salt: config.lockedUser.salt
        }).save().done(function(err) {
          should.not.exist(err);
          done();
        });
    });
  };
};

exports.login = function(user) {
  return function(done) {
    user.get(urlHelper.toUrl('/login')).end(function(err, res) {
      should.not.exist(err);
      user
        .post(urlHelper.toUrl('/login'))
        .send({
          userId: config.validUser.login,
          password: config.validUser.clearPassword
        }).end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });
  };
};
