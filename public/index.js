var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Point = require('./scripts/point.js');

app.usersConnected = 0;

app.get('/', function(req, res){ res.sendFile(__dirname + '/views/index.html'); });
app.get('/index.html.js', function(req, res) { res.sendFile(__dirname + '/scripts/index.html.js'); });
app.get('/point.js', function(req, res) { res.sendFile(__dirname + '/scripts/point.js'); });

http.listen(3000, function() {
	console.log('listening on *:3000');
});

io.on('connection', function(socket){
	app.usersConnected++;
	console.log('User connected, number of participants: ' + app.usersConnected);

	socket.on('disconnect', function(){
		app.usersConnected--;
		console.log('User disconnected, number of participants: ' + app.usersConnected);
	});

	socket.on('chat message', function(msg) {
		console.log('User said: ' + msg);
		io.emit('chat message', msg);
	})
});

