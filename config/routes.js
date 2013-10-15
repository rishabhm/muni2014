module.exports = function (app, io) {
	
	var main = require('../app/controllers/main'),
		passport = require('passport');

	app.get('/home', main.home);
	app.get('/*', main.home);
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/home', failureRedirect: '/home'}));

	io.sockets.on('connection', function(socket) {
		socket.on('testingSocket', function (data) {
			console.log(data);
			socket.emit('callingBack', {message: 'Hi there!'});
		});
		socket.on('validateRegistration', function (data) {
			main.validate(data, socket);
		});
		socket.on('validateContactForm', function (data) {
			main.contactValidate(data, socket);
		})
	});
	
};