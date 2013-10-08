var mongoose 	= require('mongoose'),
	Users 		= mongoose.model('Users');

exports.home = function (req, res) {
	Users.find({}, function (err, data) {
		console.log(data);
		res.render('home', {});
	});
	// res.render('home', {});
}