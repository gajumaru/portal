var expect = require('expect.js'),
    superagent = require('superagent'),
    helper = require('./helper');

describe('indexのテスト', function() {
  var user = superagent.agent();
  before(helper.setupFixture.setupCommonData());
  before(helper.login.login(user));

  describe('初期表示', function() {
    it('トップ画面が表示されること', function(done) {
      user.get(helper.url.toUrl('/')).end(function(err, res) {
        expect(err).to.be(null);
        expect(res.statusCode).to.be(200);
        expect(res.text).to.contain('Gajumaru Portal Top');
        done();
      });
    });
  });

});
