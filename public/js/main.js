var socket = io.connect('http://localhost'),
	currentSection = '.home',
	newSection;


function changeSections() {
	if (newSection == currentSection)
		return;
	$(currentSection).css('display', 'none');
	$(newSection).css('display', 'block');
	currentSection = newSection;
	newSection = '';
}

function refreshMenu() {
	$('.menu_item').each(function () {
		$(this).removeClass('selected');
	});
}

function saveCurrentPage() {
	socket.emit('saveCurrentPage', {section : currentSection});
}

$(document).ready(function(){
	console.log('hey! the client side javascript is linked!');
	socket.emit('testingSocket', {message: 'hello world'});
	socket.on('callingBack', function (data) {
		console.log(data);
	});
	$(currentSection).css('display', 'block');
	$('.right_col').css('height', window.innerHeight);

	// Handle user events

	$('.menu_item').on('click', function (e) {
		refreshMenu();
		$(this).addClass('selected')
		newSection = $(this).attr("section");
		changeSections();
		// saveCurrentPage();
	});

	$('.submit_btn').on('click', function (e) {
		var reg_details = {
			primary_advisor : {
				last_name : $('input[name="pa_last_name"]').val(),
				first_name : $('input[name="pa_first_name"]').val(),
				email : $('input[name="pa_email"]').val(),
				cell_number : $('input[name="pa_cell_number"]').val(),
				school_number : $('input[name="pa_school_number"]').val(),
				best_contact_way : $('select[name="pa_best_contact"]').val(),
				best_time : $('input[name="pa_call_time"]').val()
			},
			secondary_advisor : {
				last_name : $('input[name="sa_last_name"]').val(),
				first_name : $('input[name="sa_first_name"]').val(),
				email : $('input[name="sa_email"]').val(),
				cell_number : $('input[name="sa_cell_number"]').val(),
				school_number : $('input[name="sa_school_number"]').val(),
				best_contact_way : $('select[name="sa_best_contact"]').val(),
				best_time : $('input[name="sa_call_time"]').val()
			},
			addition_adv_info : $('textarea[name="advisor_additional"').val(),
			school_info : {
				name : $('input[name="s_school_name"]').val(),
				address : $('input[name="s_address"]').val(),
				city : $('input[name="s_city"]').val(),
				state : $('input[name="s_state"]').val(),
				country : $('input[name="s_country"]').val(),
				zipcode : $('input[name="s_zipcode"]').val(),
				need_transport : $('input:radio[name="s_transportation"]:checked').val()
			},
			delegate_info : {
				count : $('input[name="number_of_delegates"]').val(),
				double_del : $('input:radio[name="double_del"]:checked').val(),
				country1 : $('input[name="country_pref_1"]').val(),
				country2 : $('input[name="country_pref_2"]').val(),
				country3 : $('input[name="country_pref_3"]').val(),
				crisis : $('input:radio[name="cc_interest"]:checked').val(),
				crises : {
					polish : $('input[name="polish_gov"]').is(':checked'),
					prohibition : $('input[name="prohibition"]').is(':checked'),
					berlin : $('input[name="berlin"]').is(':checked'),
					security_council : $('input[name="sc"]').is(':checked'),
					mayflower : $('input[name="pilgrims"]').is(':checked')
				},
				security_council : $('input:radio[name="security_council"]:checked').val(),
				icc : $('input:radio[name="icc"]:checked').val(),
				ipd : $('input:radio[name="ipd"]:checked').val()
			},
			comments : $('textarea[name="comments"]').val(),
			conditions : {
				refund : $('input[name="submit_1"]').is(':checked'),
				country : $('input[name="submit_2"]').is(':checked'),
				responsible : $('input[name="submit_3"]').is(':checked')
			}
		};
		console.log(reg_details);
	});
});