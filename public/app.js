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
var clientUpdate = new ClientUpdate();
var updates = {};

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
	console.log('User connected, id: '+socket.id+' total: '+connected);

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
	socket.on('keydown', function(data) {
		var keycode = data['keycode'];
		var direction = Utility.direction_fromKeycode(keycode);
		if(direction && client.snake.direction != direction) {
			var count = data['iteration']['count'];
			var itersSince = count - gameTimer.count;

			if(itersSince > 0) {
				//Client has progressed further than the client, save this update for later
				if(!updates[count]) 
					updates[count] = {};
				updates[count][client.id] = direction;
			} else {
				//Update it for next iteration
				updateDirection(client.id, direction);
			}

			console.log('Keycode: ' +keycode+ ' client count: ' +data['iteration']['count']+ ' server count: ' +gameTimer.count );
			console.log('Position: ' +client.snake.head);
		}
	});

	socket.on('sync', function(clientid) {
		var syncUpdate = new ClientUpdate();
		allSnakes(syncUpdate);
		syncUpdate.iteration = gameTimer.portable();

		socket.emit('sync', syncUpdate.portable());
	});
	
	
	configureClient(client.id);
	spawn(client.id);
});

var gameTimer = new Timer(Timer.gameTick);
gameTimer.iteration = function() {
	//Allow clients to process this iteration

	for( var clientid in clients) {
		var client = clients[clientid];
		client.gameIteration();

		if(updates[gameTimer.count] && updates[gameTimer.count][clientid]) {
			updateDirection(clientid, updates[gameTimer.count][clientid]);
		}

		if(client.needsUpdate) {
			clientUpdate.updateSnake(clientid, client.snake);
			client.needsUpdate = false;
		}
	}

	delete updateDirection[gameTimer.count];

	//If any clientUpdate occurred since the last iteration, broadcast them
	if(!clientUpdate.empty()){
		sendUpdate(function() { clientUpdate.clear(); });
	}
}

function sendUpdate(completed) {
	//Send the clientUpdate after the offset has expired
	//This will ensure the server has processed this iteration before the client
	setTimeout(function() {
		clientUpdate.iteration = gameTimer.portable();
		io.emit('update', clientUpdate.portable());
		completed();
	}, Timer.clientOffset);
}

function updateDirection(clientid, direction) {
	var client = clients[clientid];

	if(client) {
		client.snake.direction = direction;
		client.needsUpdate = true;
	}
}

function configureClient(clientid) {
	var client = clients[clientid];

	if(client) {
		var config = new ClientUpdate();
		allSnakes(config);

		config.root = { id:clientid };
		config.removeClient(clientid);
		config.iteration = gameTimer.portable();

		setTimeout(function() {
			client.socket.emit('configure', config.portable());	
		}, Timer.clientOffset);
	}
}

function allSnakes(clientUpdate) {
	for( var clientid in clients ) {
		var client = clients[clientid];

		if(client.snake) {
			clientUpdate.updateSnake(clientid, client.snake);
		}
	}
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

		client.needsUpdate = true;
	}
}

gameTimer.start();