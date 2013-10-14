var mongoose 	= require('mongoose'),
	nodemailer 		= require('nodemailer'),
	Users 		= mongoose.model('Users');


exports.home = function (req, res) {
	Users.find({}, function (err, data) {
		console.log(data);
		res.render('home', {});
	});
	// res.render('home', {});
}

exports.validate = function (data, socket) {
	var hasErrors = 0,
		errors = "",
		emailFilter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
		numFilter = /\D/g;

	console.log(data);
	
	// Check primary advisor
	if (data.primary_advisor.last_name.length == 0) {
		hasErrors++;
		errors += "Please enter the last name of the primary advisor\n";
	}

	if(data.primary_advisor.first_name.length == 0) {
		hasErrors++;
		errors += "Please enter the first name of the primary advisor\n";
	}

	if(!emailFilter.test(data.primary_advisor.email)) {
		hasErrors++;
		errors += "Please enter a valid email for the primary advisor\n";
	}

	if (!(data.primary_advisor.cell_number.replace(numFilter, "").length === 10)) {
		hasErrors++;
		errors += "Please enter a valid cell phone number for the primary advisor\n";
	}

	// Check secondary advisor
	if (data.secondary_advisor.last_name.length == 0) {
		hasErrors++;
		errors += "Please enter the last name of the secondary advisor\n";
	}

	if(data.secondary_advisor.first_name.length == 0) {
		hasErrors++;
		errors += "Please enter the first name of the secondary advisor\n";
	}

	if(!emailFilter.test(data.secondary_advisor.email)) {
		hasErrors++;
		errors += "Please enter a valid email for the secondary advisor\n";
	}

	if (!(data.secondary_advisor.cell_number.replace(numFilter, "").length === 10)) {
		hasErrors++;
		errors += "Please enter a valid cell phone number for the secondary advisor\n";
	}

	// Check school info
	if (data.school_info.name.length == 0) {
		hasErrors++;
		errors += "Please enter a valid school name\n";
	}

	if (data.school_info.address.length == 0) {
		hasErrors++;
		errors += "Please enter a valid address\n";
	}

	if (data.school_info.city.length == 0) {
		hasErrors++;
		errors += "Please enter a valid city\n";
	}

	if (data.school_info.state.length == 0) {
		hasErrors++;
		errors += "Please enter a valid state\n";
	}

	if (data.school_info.country.length == 0) {
		hasErrors++;
		errors += "Please enter a valid country\n";
	}

	if (data.school_info.zipcode.replace(numFilter, "").length != data.school_info.zipcode.length || data.school_info.length == 0) {
		hasErrors++;
		errors += "Please enter a valid zipcode\n";
	}

	if (!data.school_info.need_transport) {
		hasErrors++;
		errors += "Do you need transport from the hotel to the conference?\n"
	}

	// Check delegate info
	if (data.delegate_info.count.replace(numFilter, "").length == 0 || parseInt(data.delegate_info.count, 10) == 0) {
		hasErrors++;
		errors += "Please enter a valid delegate count\n";
	}

	if (!data.delegate_info.double_del || typeof(data.delegate_info.double_del) == "undefined") {
		hasErrors++;
		errors += "Are you willing to take up double delegate position?\n";
	}

	if (!data.delegate_info.crisis || typeof(data.delegate_info.crisis) == "undefined") {
		hasErrors++;
		errors += "Are you interested in a position in Crisis Committees?\n";
	}

	if (data.delegate_info.crisis && data.delegate_info.crisis == "true") {
		if (data.delegate_info.crises.polish == false &&
			data.delegate_info.crises.prohibition == false &&
			data.delegate_info.crises.berlin == false && 
			data.delegate_info.crises.security_council == false &&
			data.delegate_info.crises.mayflower == false) {
			hasErrors++;
			errors += "Please select atleast one Crisis Committee preference\n";
		}
	}

	if (!data.delegate_info.security_council || typeof(data.delegate_info.security_council) == undefined) {
		hasErrors++;
		errors += "Do you want to participate in the Security Counci?\n";
	}

	if (!data.delegate_info.icc || typeof(data.delegate_info.icc) == undefined) {
		hasErrors++;
		errors += "Do you want to participate in the International Criminal Court?\n";
	}

	if (!data.delegate_info.ipd || typeof(data.delegate_info.ipd) == undefined) {
		hasErrors++;
		errors += "Do you want to participate in the International Press Delegation?\n";
	}

	if (data.conditions.refund == false || data.conditions.country == false || data.conditions.responsible == false) {
		hasErrors++;
		errors += "Please accept all the conditions before submitting the registration form\n";
	}
	

	if (hasErrors > 0) {
		socket.emit('registrationFailed', {errors : errors} );
	} else {
		socket.emit('registrationSuccess', {errors: null});
		sendMail(data);
	}	
}

function sendMail(msg) {
	var smtpTransport = nodemailer.createTransport("SMTP",{
	    service: "Gmail",
	    auth: {
	        user: "tech@uiucmodelun.org",
	        pass: "java2014"
	    }
	});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "tech@uiucmodelun.org", // sender address
    to: "rishabhmarya@gmail.com, secretarygeneral@uiucmodelun.org, gvchavez@gmail.com", // list of receivers
    subject: "Registration from " + msg.school_info.name, // Subject line
    text: JSON.stringify(msg, null, 4) // plaintext body
}

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});
}