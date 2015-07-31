var socket = io();
var snakes = { };
var clients = [];

//Canvas stuff
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var w = canvas.offsetWidth;
var h = canvas.offsetHeight;

//Lets save the cell width in a variable for easy control
var cw = 10;
var score = 0;
var id = 0;

//This is where the server configures the client
//This is also where everything is initliazed
socket.on('configure', function(data) {
	id = data['id'];

	//This will spawn players that are already connected and spawned
	update_clients(data['clients']);
});

socket.on('iteration', function(data) {
	//Unlike the other events, we don't always expect a client to be updated
	if(data['clients']) {
		//The thing we expect here is an action on a snake
		update_clients(data['clients']);	
	}

	//Move all snakes
	gameIteration();

	//Redraw everything
	refreshCanvas();
});

socket.on('collision', function(clientid) {
	delete snakes[clientid];
	console.log(clientid + ' collided with something');
});

socket.on('spawn', function(data) {
	//This is called whenever a client needs a new snake somewhere
	update_clients(data['clients']);
});

socket.on('disconnected', function(clientid) {
	delete snakes[clientid];
});

//Lets add the keyboard controls now
var keypress = [];
var lastKey = 0;
document.addEventListener('keydown', function(e) {
	var key = e.which;
	var cases = [37,38,39,40];

	if(	cases.indexOf(key) !== -1  &&  lastKey !== key ) {
		//The direction change will be applied on the server's next iteration
		keypress.push(key);
		lastKey = key;

		e.preventDefault();
	    return false;
	}
});

function gameIteration() {
	for(var clientid in snakes) {
		snakes[clientid].step();
	}

	var key = keypress.shift();
	if(key) {
		socket.emit('keydown', key); 
	}           
}
function refreshCanvas() {
	drawGrid();

	for(var clientid in snakes) {
		drawSnake(snakes[clientid]);
	}
}

function drawSnake(snake) {
	for (var i = snake.body.length - 1; i >= 0; i--) {
		var part = snake.body[i];
		drawPoint(part, snake.color);
	}
}
function drawGrid() {
	//To avoid the snake trail we need to paint the BG on every frame
	//Lets paint the canvas now
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, w, h);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, w, h);

	//Lets paint the score
	var score_text = "Score: " + score;
	ctx.fillText(score_text, 5, h-5);
}	

//Lets first create a generic function to paint points
function drawPoint(point, color) {
	var x = point.x;
	var y = point.y;

	ctx.fillStyle = color;
	ctx.fillRect(x*cw, y*cw, cw, cw);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*cw, y*cw, cw, cw);
}

//The idea is to feed it generic client data, and for it for figure out what to do with it
function update_clients(clients) {
	for( var clientid in clients ) {
		//Attempt to update snake
		update_snake(clientid, clients[clientid]);
	}
}

function update_snake(clientid, data) {
	//If server gave us a body, lets give the client a snake
	if(data['body']) {
		var snake = new Snake();
		for( var key in data['body'] ) {
			var coord = data['body'][key];
			var part = new Point(coord['x'], coord['y']);

			snake.pushPart(part);	
		}
		snakes[clientid] = snake;
		console.log('Created new snake for '+clientid);
	}

	//Otherwise check to see if snake exists before updating it's direction
	if(snakes[clientid]) {
		var snake = snakes[clientid];

		if(data['direction']) {
			snake.direction = data['direction'];
		}
		if(data['color']) {
			snake.color = data['color'];
		}
	}
}