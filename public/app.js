var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Point = require('./scripts/point.js');
var Grid = require('./scripts/grid.js');
var Snake = require('./scripts/snake.js');
var Client = require('./scripts/client.js');
var Utility = require('./scripts/utility.js');
var Timer = require('./scripts/timer.js');
var ClientUpdate = require('./scripts/clientupdate.js');


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
var clientUpdate = new ClientUpdate();
var grid = new Grid();
grid.pointWidth = 50;
grid.cellWidth = 10;

app.get('/info', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

	res.json({
		pointWidth:grid.pointWidth,
		cellWidth:grid.cellWidth,
		htmlWidth:grid.htmlWidth()
	});
});

io.on('connection', function(socket){
	connected++;
	console.log('User connected, id: '+socket.id+' total: '+connected);

	//Record client connection
	var client = new Client();
	client.id = socket.id;
	client.socket = socket;
	clients[client.id] = client;
	
	//Called when this client disconnects
	socket.on('disconnect', function(){
		delete clients[client.id];
		connected--;

		console.log('User disconnected, id '+client.id+' total: '+connected);
	});

	//Called when client presses a button
	socket.on('keydown', function(keycode) {
		var direction = Utility.direction_fromKeycode(keycode);

		if(client.snake) {
			if(direction && client.snake.direction != direction && client.snake.direction != Utility.direction_opposite(direction)) {
				updateDirection(client.id, direction);
			}
		}
	});
	
	configureClient(client.id);
	spawn(client.id);
});

var gameTimer = new Timer(90);
gameTimer.iteration = function() {
	//Allow clients to process this iteration

	for( var clientid in clients) {
		var client = clients[clientid];

		if(client.snake) {
			if(!grid.containsPoint(client.snake.next) || client.snake.containsPoint(client.snake.next)) {
				client.snake = null;
				io.emit('collision', clientid);
			} else {
				if(grid.removeFood(client.snake.next)) {
					//Client just ate food
				}

				client.snake.step();
			}
		}
	}

	//If any clientUpdate occurred since the last iteration, broadcast them
	var data = (!clientUpdate.empty()) ? clientUpdate.portable() : {};
		
	io.emit('iteration', data);
	clientUpdate.clear();
}
gameTimer.start();

function updateDirection(clientid, direction) {
	var client = clients[clientid];

	if(client) {
		client.snake.direction = direction;
		clientUpdate.update(clientid, 'direction', direction);
	}
}

function configureClient(clientid) {
	var client = clients[clientid];

	if(client) {
		var config = new ClientUpdate();
		allSnakes(config);

		config.root = { id:clientid };
		config.removeClient(clientid);

		client.socket.emit('configure', config.portable());	
	}
}

function allSnakes(clientUpdate) {
	for( var clientid in clients ) {
		var client = clients[clientid];

		if(client.snake) {
			clientUpdate.update(clientid, 'body', client.snake.body);
		}
	}
}

function spawn(clientid) {
	var client = clients[clientid];

	if(client) {
		var direction = 'right';
		var opposite = Utility.direction_opposite(direction);
		var body = (new Point(5,5)).walk(opposite, 100);

		var snake = new Snake();
		for( var part in body ) {
			snake.pushPart(body[part]);
		}
		snake.direction = direction;
		
		client.snake = snake;

		io.emit('spawn', {
			id:clientid,
			direction:direction,
			body:body
		});
	}
}