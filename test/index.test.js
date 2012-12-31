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

describe('indexのテスト', function() {
  var user = superagent.agent();
  login(user);

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
