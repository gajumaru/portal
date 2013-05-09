var messages = require('message'),
    should = require('should'),
    superagent = require('superagent'),
    setupFixtureHelper = require('./helper/setup-fixture'),
    urlHelper = require('./helper/url');

var tryToLogin = function(userId, password, callback) {
  var user = superagent.agent();
  user
    .post(urlHelper.toUrl('/login'))
    .send({
      userId: userId,
      password: password
    }).end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.should.be.html;
      callback(res);
    });
};

describe('loginのテスト', function() {
  describe('初期表示', function() {
    var anon = superagent.agent();
    it('ログイン画面が表示されること', function(done) {
      anon.get(urlHelper.toUrl('/login')).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.should.be.html;
        res.text.should.include('login');
        done();
      });
    });
  });

  describe('ログイン', function() {
    before(setupFixtureHelper.setupCommonData());

    describe('有効なユーザ情報でログイン', function() {
      var validUser = superagent.agent();
      it('トップ画面へ遷移すること', function(done) {
        tryToLogin('valid_user', 'password', function(res) {
          res.redirects.should.eql([urlHelper.toUrl('/')]);
          done();
        });
      });
    });

    describe('有効でないユーザ情報でログイン', function() {
      var inValidUser = superagent.agent();
      it('ユーザIDが未入力の場合、ログインできないこと', function(done) {
        tryToLogin('', 'password', function(res) {
          res.text.should.include(messages.get('is_required', 'userId'));
          done();
        });
      });
      it('パスワードが未入力の場合、ログインできないこと', function(done) {
        tryToLogin('valid_user', '', function(res) {
          res.text.should.include(messages.get('is_required', 'password'));
          done();
        });
      });
      it('ユーザIDが誤っている場合、ログインできないこと', function(done) {
        tryToLogin('invalidUserId', 'password', function(res) {
          res.text.should.include(messages.get('invalid_userId_or_password'));
          done();
        });
      });
      it('パスワードが誤っている場合、ログインできないこと', function(done) {
        tryToLogin('valid_user', 'invalidPassword', function(res) {
          res.text.should.include(messages.get('invalid_userId_or_password'));
          done();
        });
      });
      it('ロックされたユーザの場合、ログインできないこと', function(done) {
        tryToLogin('locked_user', 'password', function(res) {
          res.text.should.include(messages.get('invalid_userId_or_password'));
          done();
        });
      });
    });
  });

});
