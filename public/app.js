var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Point = require('./scripts/point.js');
var Snake = require('./scripts/snake.js');
var Client = require('./scripts/client.js');
var Utility = require('./scripts/utility.js');
var Timer = require('./scripts/timer.js');
var ClientUpdate = require('./scripts/clientupdate.js');

//Whenever an update is made, we save the changes and only send
//the updates on the next game iteration
var update = new ClientUpdate();

//Router
app.get('/', function(req, res){ res.sendFile(__dirname + '/views/index.html'); });
app.get('/index.html.js', function(req, res) { res.sendFile(__dirname + '/scripts/index.html.js'); });
app.get('/point.js', function(req, res) { res.sendFile(__dirname + '/scripts/point.js'); });
app.get('/snake.js', function(req, res) { res.sendFile(__dirname + '/scripts/snake.js'); });
app.get('/timer.js', function(req, res) { res.sendFile(__dirname + '/scripts/timer.js'); });
app.get('/utility.js', function(req, res) { res.sendFile(__dirname + '/scripts/utility.js'); });

//Server
http.listen(3000, function() { console.log('listening on *:3000'); });

//App logic
var clients = [];
var connected = 0;
io.on('connection', function(socket){
	//Record client connection
	var client = new Client(socket);
	clients[client.id] = client;
	connected++;
	
	//Called when this client disconnects
	socket.on('disconnect', function(){
		delete clients[client.id];
		connected--;

		console.log('User disconnected, id '+client.id+' total: '+connected);
	});

	//Called when client presses a button
	socket.on('keydown', function(key) {
		var direction = Utility.direction_fromKeycode(key);
		if(direction && client.snake.direction != direction) {
			//Change snake direction
			client.snake.direction = direction;

			//Update clients with new state of snake
			update.clients[client.id] = client.snake.portable();
		}
	});
	
	console.log('User connected, id: '+client.id+' total: '+connected);
	configureClient(client.id);
	spawn(client.id);
});

var gameTimer = new Timer(Timer.gameTick);
gameTimer.iteration = function() {
	//Allow clients to process this iteration
	for( var clientid in clients) {
		clients[clientid].gameIteration();
	}

	//If any update occurred since the last iteration, broadcast them
	if(!update.empty()){
		update.iteration = gameTimer.portable();
		io.emit('update', update.portable());
		update.clear();
	}
}

function configureClient(clientid) {
	var client = clients[clientid];

	if(client) {
		var config = new ClientUpdate();
		var clientsInfo = clientsSnakes();

		delete clientsInfo[clientid];

		config.root = { id:clientid };
		config.clients = clientsInfo;
		config.iteration = gameTimer.portable();

		client.socket.emit('configure', config.portable());
	}
}

function clientsSnakes() {
	var info = {};
	for( var clientid in clients ) {
		var client = clients[clientid];

		if(client.snake) {
			info[clientid] = client.snake.portable();
		}
	}

	return info;
}

function spawn(clientid) {
	var client = clients[clientid];

	if(client) {
		var direction = 'right';
		var opposite = Utility.direction_opposite(direction);
		var body = (new Point(5,5)).walk(opposite, Snake.spawnSize);
		
		client.snake = new Snake();
		client.snake.body = body;
		client.snake.direction = direction;

		update.clients[clientid] = client.snake.portable();
	}
}

gameTimer.start();