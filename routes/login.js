var messages = require('message'),
    models = require('models'),
    User = models.requireModel('user');

exports.index = function(req, res) {
  res.render('login', {title: 'login', message: ''});
};

exports.login = function(req, res) {
  if (!req.body.userId) {
    res.render('login', {title: 'ERROR', message: messages.get('is_required', 'userId')});
    return;
  }
  if (!req.body.password) {
    res.render('login', {title: 'ERROR', message: messages.get('is_required', 'password')});
    return;
  }

  User.tryToLogin(req.body.userId, req.body.password, function(err, user) {
    if (err) {
      throw err;
    }
    if (!user) {
      res.render('login', {title: 'ERROR', message: messages.get('invalid_userId_or_password')});
      return;
    }
    req.session.regenerate(function(err) {
      if (err) {
        throw err;
      }
      req.session.userId = req.body.userId;
      res.redirect('/');
    });
  });
};
