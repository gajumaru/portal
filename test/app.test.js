var config = require('config'),
    should = require('should'),
    superagent = require('superagent'),
    loginHelper = require('./helper/login'),
    setupFixtureHelper = require('./helper/setup-fixture'),
    urlHelper = require('./helper/url');

describe('appのテスト', function() {
  describe('ログインチェック、ルーティング', function() {
    describe('未ログインの場合', function() {
      var anon = superagent.agent();
      it('トップ画面へアクセスしても、ログイン画面へリダイレクトされること', function(done) {
        anon.get(urlHelper.toUrl('/')).end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.redirects.should.eql([urlHelper.toUrl('/login')]);
          done();
        });
      });

      it('ログイン画面へはアクセスできること', function(done) {
        anon.get(urlHelper.toUrl('/login')).end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
      });
    });

    describe('ログイン済の場合', function() {
      var user = superagent.agent();
      before(setupFixtureHelper.setupCommonData());
      before(loginHelper.login(user));

      it('トップ画面へアクセスできること', function(done) {
        user.get(urlHelper.toUrl('/')).end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
      });
    });
  });

});