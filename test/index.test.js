var app = require('../app'),
    config = require('config'),
    should = require('should'),
    superagent = require('superagent'),
    util = require('util'),
    dbConnector = require('db-connect'),
    loginHelper = require('./helper/login'),
    urlHelper = require('./helper/url');

describe('indexのテスト', function() {
  var user = superagent.agent();
  before(loginHelper.setUpValidUser());
  before(loginHelper.login(user));

  describe('初期表示', function() {
    it('トップ画面が表示されること', function(done) {
      user.get(urlHelper.toUrl('/')).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.should.be.html;
        res.text.should.include('Gajumaru Portal Top');
        done();
      });
    });
  });

});
