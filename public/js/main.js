var socket = io.connect('http://localhost');

$(document).ready(function(){
	console.log('hey! the client side javascript is linked!');
	socket.emit('testingSocket', {message: 'hello world'});
	socket.on('callingBack', function (data) {
		console.log(data);
	});
});