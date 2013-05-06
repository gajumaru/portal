var should = require('should'),
    superagent = require('superagent'),
    setupFixtureHelper = require('./helper/setup-fixture'),
    loginHelper = require('./helper/login'),
    urlHelper = require('./helper/url');

describe('indexのテスト', function() {
  var user = superagent.agent();
  before(setupFixtureHelper.setupCommonData());
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
