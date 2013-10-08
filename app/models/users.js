var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username 	: String,
	email 		: String,
	name 		: String,
	provider 	: String,
	facebook 	: {}
});

userSchema.methods = {
	//METHODS HERE
}

mongoose.model('Users', userSchema);