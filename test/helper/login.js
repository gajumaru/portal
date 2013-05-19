var urlHelper = require('./url'),
    models = require('models'),
    User = models.requireModel('user');

exports.login = function(user) {
  return function(done) {
    user.get(urlHelper.toUrl('/login')).end(function(err, res) {
      if (err) {
        return done(err);
      }
      user
        .post(urlHelper.toUrl('/login'))
        .send({
          userId: 'valid_user',
          password: 'password'
        }).end(function(err, res) {
          done(err);
        });
    });
  };
};
