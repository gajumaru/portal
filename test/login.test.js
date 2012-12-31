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
    describe('正しいユーザ情報でログイン', function() {
      var validUser = superagent.agent();
      it('トップ画面へ遷移すること', function(done) {
        validUser.post(testUrl('/login')).send({ userId: 'test', password: 'test' }).end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.should.be.html;
          res.redirects.should.eql([testUrl('/')]);
          done();
        });
      });
    });

    describe('誤ったユーザ情報でログイン', function() {
      var wrongUser = superagent.agent();
      it('ユーザIDが空の場合、ログインできないこと', function(done) {
        wrongUser.post(testUrl('/login')).send({ userId: '' }).end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Please enter USER ID');
          done();
        });
      });
    });
  });

});
