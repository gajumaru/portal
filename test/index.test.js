var app = require('../app.js'),
    config = require('config'),
    should = require('should'),
    superagent = require('superagent'),
    util = require('util');

var testUrl = function(path) {
  if (path.substr(0, 1) !== '/') {
    path = '/' + path;
  }
  return util.format('http://localhost:%d%s', app.get('port'), path);
};

var setUpUserData = function(done) {
  var Sequelize = require('sequelize');
  var sequelize = new Sequelize('', '', '', {
    dialect: 'sqlite',
    storage: config.redmineDatabase.storage
  });
  var User = sequelize.import(__dirname + "/../models/user");
  User.sync({force: true}).done(function(err) {
    should.not.exist(err);
    User
      .build({
        id: 1,
        login: config.validUser.login,
        hashed_password: config.validUser.hashedPassword,
        status: 1,
        salt: config.validUser.salt
      }).save().done(function(err) {
        should.not.exist(err);
        done();
      });
  });
};

var login = function(user) {
  return function(done) {
    user.get(testUrl('/login')).end(function(err, res) {
      should.not.exist(err);
      user
        .post(testUrl('/login'))
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

describe('indexのテスト', function() {
  var user = superagent.agent();
  before(setUpUserData);
  before(login(user));
  
  describe('初期表示', function() {
    it('トップ画面が表示されること', function(done) {
      user.get(testUrl('/')).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.should.be.html;
        res.text.should.include('Gajumaru Portal Top');
        done();
      });
    });
  });

});
