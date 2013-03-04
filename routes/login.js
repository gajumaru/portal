var config = require('config').redmineDatabase;
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port || 3306
});
var User = sequelize.import(__dirname + "/../models/user");

exports.index = function(req, res) {
  // redirect to index
  res.render('login', {title:'login', message:''});
};

exports.login = function(req, res) {
  if (req.body.userId) {
    User.tryToLogin(req.body.userId, req.body.password, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        res.render('login', {title:'ERROR', message:'ユーザかパスワードが誤っています'});
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
  } else {
    res.render('login', {title:'ERROR', message:'Please enter USER ID'});
  }
};
