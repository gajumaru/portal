var net = require('net'),
    app = require('../../app');

var waitForServerStart = function(done) {
  var port = app.get('port');

  return function() {
    var client = net.connect(port, function() {
      client.end();
      done();
    });

    client.on('error', function(err) {
      client.end();
      setTimeout(waitForServerStart(done)(), 1000);
    });
  };
};

before(function(done) {
  this.timeout(10000);
  waitForServerStart(done)();
});

exports.login = require('./login');
exports.setupFixture = require('./setup-fixture');
exports.url = require('./url');
