exports.index = function(req, res) {
  // redirect to index
  res.render('login', {title:'login', message:''});
};

exports.login = function(req, res) {
  if (req.body.userId) {
    req.session.regenerate(function(err) {
      if (err) {
        throw err;
      } else {
        req.session.userId = req.body.userId;
        res.redirect('/');
      }
    });
  } else {
    res.render('login', {title:'ERROR', message:'Please enter USER ID'});
  }
};
