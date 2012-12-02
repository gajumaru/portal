var app = require('../app.js');

var should = require('should'),
    request = require('request'),
    util = require('util');

var testUrl = function(path) {
  if (path.substr(0, 1) !== '/') {
    path = '/' + path;
  }
  return util.format('http://localhost:%d%s', app.get('port'), path);
}

describe('appのテスト', function() {
  describe('GET /', function() {
    it('HTMLが返ること', function(done) {
      request.get({
        url: testUrl('/')
      }, function(err, res, body) {
        if (err) return done(err);
        res.statusCode.should.equal(200);
        res.should.be.html;
        body.should.include('Welcome to Express');
        done();
      });
    });
  });
  describe('GET /user/list', function() {
    it('HTMLが返ること', function(done) {
      request.get({
        url: testUrl('/user/list')
      }, function(err, res, body) {
        if (err) return done(err);
        res.statusCode.should.equal(200);
        res.should.be.html;
        body.should.include('respond with a resource');
        done();
      });
    });
  });
});
