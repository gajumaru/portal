var expect = require('expect.js'),
    superagent = require('superagent'),
    helper = require('./helper');

describe('appのテスト', function() {
  describe('ログインチェック、ルーティング', function() {
    describe('未ログインの場合', function() {
      var anon = superagent.agent();
      it('トップ画面へアクセスしても、ログイン画面へリダイレクトされること', function(done) {
        anon.get(helper.url.toUrl('/')).end(function(err, res) {
          expect(err).to.be(null);
          expect(res.statusCode).to.be(200);
          expect(res.redirects).to.contain(helper.url.toUrl('/login'));
          done();
        });
      });

      it('ログイン画面へはアクセスできること', function(done) {
        anon.get(helper.url.toUrl('/login')).end(function(err, res) {
          expect(err).to.be(null);
          expect(res.statusCode).to.be(200);
          done();
        });
      });
    });

    describe('ログイン済の場合', function() {
      var user = superagent.agent();
      before(helper.setupFixture.setupCommonData());
      before(helper.login.login(user));

      it('トップ画面へアクセスできること', function(done) {
        user.get(helper.url.toUrl('/')).end(function(err, res) {
          expect(err).to.be(null);
          expect(res.statusCode).to.be(200);
          done();
        });
      });
    });
  });

});