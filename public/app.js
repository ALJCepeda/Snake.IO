var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var Point = require('./scripts/point.js');
var Grid = require('./scripts/grid.js');
var Snake = require('./scripts/snake.js');
var Client = require('./scripts/client.js');
var Utility = require('./scripts/utility.js');
var Timer = require('./scripts/timer.js');
var ClientUpdate = require('./scripts/clientupdate.js');

//Global data
var clients = {};
var connected = [];

var update = new ClientUpdate();
var grid = new Grid();
grid.pointWidth = 65;
grid.cellWidth = 10;

var isLocal = true;
var spawnSize = 5;
var minFood = 100;
var clientScript = bundle_scripts([
		'point.js',
		'snake.js',
		'utility.js',
		'index.html.js',
	]);

if(!isLocal) {
	//Removes comments and extra white spaces
	clientScript = clientScript.replace(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g, " ")
	  							.replace(/\s+/g, " ");
}

//Server
http.listen(8001, function() { console.log('listening on *:8001'); });

//Router
app.get('/', function(req, res){ 
	var html = fs.readFileSync(__dirname + '/views/index.html'); 
	html = html.toString().replace("{{gitChecksum}}", gitCheck());
	res.send(html);
});
app.get("/index_"+gitCheck()+".js", function(req, res) { res.send(clientScript); });

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
	

	//Record client connection
	var client = new Client();
	client.id = socket.id;
	client.socket = socket;
	client.nickname = 'Snakeman';
	
	connected.push(client.id);
	clients[client.id] = client;
	//Called when this client disconnects
	socket.on('disconnect', function(){
		connected.splice(connected.indexOf(client.id), 1);
		delete clients[client.id];

		io.emit('disconnected', client.id);
		console.log('User disconnected, id '+client.id+' total: '+connected.length);
		//client = null;
	});

	//Called when client presses a button
	socket.on('keydown', function(keycode) {
		var direction = Utility.direction_fromKeycode(keycode);

		if(client.snake) {
			if(direction && client.snake.direction != direction && client.snake.direction != Utility.direction_opposite(direction)) {
				client.snake.direction = direction;
				update.update(client.id, 'direction', direction);
			}
		}
	});
	
	configure_client(client);
	spawn(client);

	console.log('User connected, id: '+socket.id+' total: '+connected.length);
});

var gameTimer = new Timer(90);
gameTimer.iteration = function() {
	//If any update occurred since the last iteration, broadcast them
	var data = (!update.empty()) ? update.portable() : {};
	io.emit('iteration', data);

	update.clear();

	//Allow clients to process this iteration
	for( var clientid in clients) {
		var client = clients[clientid];

		if(client.snake) {
			if(!grid.containsPoint(client.snake.next) || client.snake.containsPoint(client.snake.next)) {
				client.snake = null;
				update.add_collision(client.id);
			} else {
				client.snake.step();
			}
		}
	}

	//Now resolve any issues with the snake positions
	resolve_snakes();

	var foodNeeded = minFood - grid.foodCount;
	if(foodNeeded > 0) {
		create_food(foodNeeded);
	}
}
gameTimer.start();

function resolve_snakes() {
	var collisions = [];
	var ateFood = {}

	//After all snakes have been resolved, we check to see if any snakes collided with each other
	for (var i = connected.length - 1; i >= 0; i--) {
		var clientid = connected[i];
		var client = clients[clientid];

		if(!client.snake) continue;

		for (var x = connected.length - 1; x >= 0; x--) {
			var otherid = connected[x];
			var other = clients[otherid];

			if(!other.snake || other === client) continue;

			if(client.snake.head.equals(other.snake.head)) {
				//Snakes collided into each other
				if(client.snake.body.length === other.snake.body.length) {
					client.snake = null;
					other.snake = null;
					update.add_collision(client.id);
					update.add_collision(other.id);
				} else {
					var dead = (client.snake.body.length > other.snake.body.length) ? other : client;
					dead.snake = null;
					update.add_collision(dead.id);
				}
			} else if(other.snake.containsPoint(client.snake.head)) {
				client.snake = null;
				update.add_collision(client.id);
			}

			if(!client.snake) break;
		};

		//Check to see if the snake died before eating food
		if(!client.snake) continue;
		if(grid.removeFood(client.snake.head)) {
			//Add a tail which will appear once the snake takes a step
			client.snake.pushTail();
			update.add_ate(client.id, client.snake.head.toString());
		}
	};
}

function create_food(count) {
	for (var i = count-1; i >= 0; i--) {
		var x = Math.floor((Math.random() * (grid.pointWidth - 1)) + 1);
		var y = Math.floor((Math.random() * (grid.pointWidth - 1)) + 1);

		var food = new Point(x, y);
		food.color = Utility.random_color();

		if(grid.hasFood(food)) {
			count--;
		} else {
			grid.addFood(food);
			update.add_food(food.toString(), food);
		}
	};
}

function configure_client(client) {
	var config = new ClientUpdate();
	allClients(config);

	config.root = {
		id:client.id,
		cellWidth:grid.cellWidth,
		pointWidth:grid.pointWidth
	};

	config.food = grid.food;
	config.remove_client(client.id);

	client.socket.emit('configure', config.portable());	
}

function allClients(update) {
	update.root['connected'] = [];
	for( var clientid in clients ) {
		var client = clients[clientid];

		if(client.snake) {
			update.clients[client.id] = client.snake.portable();
		}

		update.update(client.id, 'nickname', client.nickname);
	}
}

function spawn(client) {
	var direction = 'right';
	var opposite = Utility.direction_opposite(direction);
	var body = (new Point(5,5)).walk(opposite, spawnSize);

	var snake = new Snake();
	for( var part in body ) {
		snake.pushPart(body[part]);
	}
	snake.direction = direction;
	snake.color = Utility.random_color();

	client.snake = snake;

	var spawnInfo = new ClientUpdate();
	spawnInfo.clients[client.id] = client.snake.portable();

	io.emit('spawn', spawnInfo.portable());
}

function gitCheck() {
	var branch = fs.readFileSync(__dirname + '/../.git/refs/heads/master');
	return branch.toString().replace(/\r?\n|\r/g, "");
}

function bundle_scripts(scripts) {
	var scriptsDir = __dirname + '/scripts/';

	var result = '';
	for (var i = scripts.length - 1; i >= 0; i--) {
		var scriptName = scripts[i];
		result = result + fs.readFileSync(scriptsDir + scriptName).toString();
	}
	return result;
}