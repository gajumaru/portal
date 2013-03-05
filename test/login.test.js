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
        status: config.validUser.status,
        salt: config.validUser.salt
      }).save().done(function(err) {
        should.not.exist(err);
        User
          .build({
            id: 2,
            login: config.lockedUser.login,
            hashed_password: config.lockedUser.hashedPassword,
            status: config.lockedUser.status,
            salt: config.lockedUser.salt
          }).save().done(function(err) {
            should.not.exist(err);
            done();
          });
      });
  });
};

describe('loginのテスト', function() {
  describe('初期表示', function() {
    var anon = superagent.agent();
    it('ログイン画面が表示されること', function(done) {
      anon.get(testUrl('/login')).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.should.be.html;
        res.text.should.include('login');
        done();
      });
    });
  });

  describe('ログイン', function() {
    before(setUpUserData);

    describe('有効なユーザ情報でログイン', function() {
      var validUser = superagent.agent();
      it('トップ画面へ遷移すること', function(done) {
        validUser
          .post(testUrl('/login'))
          .send({
            userId: config.validUser.login,
            password: config.validUser.clearPassword
          }).end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.html;
            res.redirects.should.eql([testUrl('/')]);
            done();
          });
      });
    });

    describe('有効でないユーザ情報でログイン', function() {
      var inValidUser = superagent.agent();
      it('ユーザIDが未入力の場合、ログインできないこと', function(done) {
        inValidUser
          .post(testUrl('/login'))
          .send({
            userId: '',
            password: config.validUser.clearPassword
          }).end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.html;
            res.text.should.include('Please enter USER ID');
            done();
          });
      });
      it('パスワードが未入力の場合、ログインできないこと', function(done) {
        inValidUser
          .post(testUrl('/login'))
          .send({
            userId: config.validUser.login,
            password: ''
          }).end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.html;
            res.text.should.include('Please enter PASSWORD');
            done();
          });
      });
      it('ユーザIDが誤っている場合、ログインできないこと', function(done) {
        inValidUser
          .post(testUrl('/login'))
          .send({
            userId: 'invalidUserId',
            password: config.validUser.clearPassword
          }).end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.html;
            res.text.should.include('ユーザIDかパスワードが誤っています');
            done();
          });
      });
      it('パスワードが誤っている場合、ログインできないこと', function(done) {
        inValidUser
          .post(testUrl('/login'))
          .send({
            userId: config.validUser.login,
            password: 'invalidPassword'
          }).end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.html;
            res.text.should.include('ユーザIDかパスワードが誤っています');
            done();
          });
      });
      it('ロックされたユーザの場合、ログインできないこと', function(done) {
        inValidUser
          .post(testUrl('/login'))
          .send({
            userId: config.lockedUser.login,
            password: config.lockedUser.clearPassword
          }).end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.html;
            res.text.should.include('ユーザIDかパスワードが誤っています');
            done();
          });
      });
    });
  });

});
