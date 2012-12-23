exports.index = function(req, res) {
  // redirect to index
  res.render('login', {title:'login', message:''});
};

exports.login = function(req, res) {
	if (req.body.userId != '') {
    req.session.userId = req.body.userId;
	}
	res.redirect('/');
};
