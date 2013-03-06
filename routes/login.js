var messages = require('message'),
    dbConnector = require('db-connect'),
    redmineDB = dbConnector.connectRedmine(),
    User = redmineDB.loadEntity('user');

exports.index = function(req, res) {
  res.render('login', {title: 'login', message: ''});
};

exports.login = function(req, res) {
  if (!req.body.userId) {
    res.render('login', {title: 'ERROR', message: messages.userId_is_required});
    return;
  }
  if (!req.body.password) {
    res.render('login', {title: 'ERROR', message: messages.password_is_required});
    return; 
  }
  User.tryToLogin(req.body.userId, req.body.password, function(err, user) {
    if (err) {
      throw err;
    }
    if (!user) {
      res.render('login', {title: 'ERROR', message: messages.invalid_userId_or_password});
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
