var express 	= require('express'),
	app 		= express(),
	http 		= require('http'),
	server 		= http.createServer(app),
    io          = require('socket.io').listen(server),
	fs 			= require('fs'),
	mongoose 	= require('mongoose'),
	config 		= require('./config/config')['dev_mode'];

mongoose.connect(config.db);
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path+'/'+file)
})

var User = mongoose.model('Users');

var passport            = require('passport'),
    FacebookStrategy    = require('passport-facebook').Strategy,
    LocalStrategy       = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    console.log('Inside the serializer function')
    console.log(user)
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        done(err, user)
    })
})

passport.use(new FacebookStrategy({
    clientID: '332629783550339',
    clientSecret: '7de88ea7d39e4d676a582295675a2cbe',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({'facebook.id' : profile.id}, function (err, user) {
        if (user) {
            done(null, user);
        } else {
            console.log(profile);
            var user = new User({
                username    : profile.id,
                // email       : profile.emails[0].value,
                name        : profile.displayName,
                provider    : 'facebook',
                facebook    : profile._json
            });
            user.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(user);
                    return done(err, user);
                }
            });
        }
    });
  }
));

app.configure(function(){
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(config.root + '/public'));
    app.use(app.router);
});



require('./config/routes')(app, io);

server.listen(3000);

console.log('listening on port 3000');

exports = module.exports = app;


