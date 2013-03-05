var dbConnector = require('db-connect'),
    redmineDB = dbConnector.connectRedmine(),
    User = redmineDB.loadEntity('user');

exports.index = function(req, res) {
  res.render('login', {title:'login', message:''});
};

exports.login = function(req, res) {
  if (!req.body.userId) {
    res.render('login', {title:'ERROR', message:'Please enter USER ID'});
    return;
  }
  if (!req.body.password) {
    res.render('login', {title:'ERROR', message:'Please enter PASSWORD'});
    return; 
  }
  User.tryToLogin(req.body.userId, req.body.password, function(err, user) {
    if (err) {
      throw err;
    }
    if (!user) {
      res.render('login', {title:'ERROR', message:'ユーザIDかパスワードが誤っています'});
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
