var express 	= require('express'),
	app 		= express(),
	http 		= require('http'),
	server 		= http.createServer(app),
	fs 			= require('fs'),
	mongoose 	= require('mongoose'),
	config 		= require('./config/config')['dev_mode'];

app.configure(function(){
	app.set('views', config.root + '/app/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});


mongoose.connect(config.db);
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path+'/'+file)
})

require('./config/routes')(app);

server.listen(3000);

console.log('listening on port 3000');

exports = module.exports = app;


