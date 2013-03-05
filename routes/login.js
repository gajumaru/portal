var config = require('config').redmineDatabase;
var Sequelize = require('sequelize');
var sequelize;
if (config.dialect !== 'sqlite') {
  sequelize = new Sequelize(config.database, config.user, config.password, {
    dialect: config.dialect || 'mysql',
    host: config.host,
    port: config.port || 3306
  });
} else {
  sequelize = new Sequelize('', '', '', {
    dialect: 'sqlite',
    storage: config.storage
  });
}
var User = sequelize.import(__dirname + "/../models/user");

exports.index = function(req, res) {
  // redirect to index
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
