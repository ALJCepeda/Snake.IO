var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Point = require('./scripts/point.js');
var Snake = require('./scripts/snake.js');
var Client = require('./scripts/client.js');

var game_tick = 60; //ms
var game_timer = setInterval(gameIteration, game_tick);
app.usersConnected = 0;

app.get('/', function(req, res){ res.sendFile(__dirname + '/views/index.html'); });
app.get('/index.html.js', function(req, res) { res.sendFile(__dirname + '/scripts/index.html.js'); });
app.get('/point.js', function(req, res) { res.sendFile(__dirname + '/scripts/point.js'); });

http.listen(3000, function() {
	console.log('listening on *:3000');
});

var clients = [];
var connected = 0;
io.on('connection', function(socket){
	var client = new Client();
	client.id = socket.id;
	client.index = connected;
	client.snake = new Snake(new Point(5,5), 'right', 5);

	clients[client.id] = client;
	connected++;
	
	socket.on('disconnect', function(){
		delete clients[client.id];
		connected--;
		console.log('User disconnected, id '+client.id+' total: '+connected);
	});

	socket.on('keydown', function(key) {
		var direction = direction_fromKey(key);
		if(direction) {
			client.snake.direction = direction;
		}
	});
	
	console.log('User connected, id: '+client.id+' total: '+connected);
});

function gameIteration() {
	var cells = [];
	for( var clientid in clients) {
		var client = clients[clientid];
		client.gameIteration();

		cells = cells.concat(client.snake.body);
	}
	io.emit('draw', { cells:cells });
}

function direction_fromKey(key) {
	var cases = {
		37:'left',
		38:'up',
		39:'right',
		40:'down'
	}

	return cases[key] || '';
}
