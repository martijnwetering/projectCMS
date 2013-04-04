exports.checkAuth = function(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
    res.redirect('');
  } else {
  	console.log('autherized');
    next();
  }
}

exports.login = function(req, res) {
	var post = req.body;
	console.log("loggin");
	if (post.user == 'admin' && post.password == 'admin') {
		req.session.user_id = post.user;
	    res.redirect('#cms/projects');
	} else {
	    res.send('Bad user/pass', post.user);
	}
}

exports.logout =  function(req, res) {
  delete req.session.user_id;
  res.redirect('');
}