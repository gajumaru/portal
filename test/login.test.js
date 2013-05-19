var messages = require('message'),
    expect = require('expect.js'),
    superagent = require('superagent'),
    helper = require('./helper');

var tryToLogin = function(userId, password, callback) {
  var user = superagent.agent();
  user
    .post(helper.url.toUrl('/login'))
    .send({
      userId: userId,
      password: password
    }).end(function(err, res) {
      expect(err).to.be(null);
      expect(res.statusCode).to.be(200);
      callback(res);
    });
};

describe('loginのテスト', function() {
  describe('初期表示', function() {
    var anon = superagent.agent();
    it('ログイン画面が表示されること', function(done) {
      anon.get(helper.url.toUrl('/login')).end(function(err, res) {
        expect(err).to.be(null);
        expect(res.statusCode).to.be(200);
        expect(res.text).to.contain('login');
        done();
      });
    });
  });

  describe('ログイン', function() {
    before(helper.setupFixture.setupCommonData());

    describe('有効なユーザ情報でログイン', function() {
      var validUser = superagent.agent();
      it('トップ画面へ遷移すること', function(done) {
        tryToLogin('valid_user', 'password', function(res) {
          expect(res.redirects).to.contain(helper.url.toUrl('/'));
          done();
        });
      });
    });

    describe('有効でないユーザ情報でログイン', function() {
      var inValidUser = superagent.agent();
      it('ユーザIDが未入力の場合、ログインできないこと', function(done) {
        tryToLogin('', 'password', function(res) {
          expect(res.text).to.contain(messages.get('is_required', 'userId'));
          done();
        });
      });
      it('パスワードが未入力の場合、ログインできないこと', function(done) {
        tryToLogin('valid_user', '', function(res) {
          expect(res.text).to.contain(messages.get('is_required', 'password'));
          done();
        });
      });
      it('ユーザIDが誤っている場合、ログインできないこと', function(done) {
        tryToLogin('invalidUserId', 'password', function(res) {
          expect(res.text).to.contain(messages.get('invalid_userId_or_password'));
          done();
        });
      });
      it('パスワードが誤っている場合、ログインできないこと', function(done) {
        tryToLogin('valid_user', 'invalidPassword', function(res) {
          expect(res.text).to.contain(messages.get('invalid_userId_or_password'));
          done();
        });
      });
      it('ロックされたユーザの場合、ログインできないこと', function(done) {
        tryToLogin('locked_user', 'password', function(res) {
          expect(res.text).to.contain(messages.get('invalid_userId_or_password'));
          done();
        });
      });
    });
  });

});
