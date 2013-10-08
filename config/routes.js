module.exports = function (app) {
	
	var main = require('../app/controllers/main');

	app.get('/home', main.home);
	
};