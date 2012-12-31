var app = require('../app.js');

var should = require('should'),
    superagent = require('superagent'),
    util = require('util');

var testUrl = function(path) {
  if (path.substr(0, 1) !== '/') {
    path = '/' + path;
  }
  return util.format('http://localhost:%d%s', app.get('port'), path);
};

var login = function(user) {
  user.post(testUrl('/login')).send({ userId: 'test', password: 'test' }).end(function(err, res) {
    should.not.exist(err);
  });
};

describe('appのテスト', function() {
  describe('ログインチェック、ルーティング', function() {
    describe('未ログインの場合', function() {
      var anon = superagent.agent();
      it('トップ画面へアクセスしても、ログイン画面へリダイレクトされること', function(done) {
        anon.get(testUrl('/')).end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.redirects.should.eql([testUrl('/login')]);
          done();
        });
      });

      it('ログイン画面へはアクセスできること', function(done) {
        anon.get(testUrl('/login')).end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
      });
    });

    describe('ログイン済の場合', function() {
      var user = superagent.agent();
      login(user);
      it('トップ画面へアクセスできること', function(done) {
        user.get(testUrl('/')).end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
      });
    });
  });

});
