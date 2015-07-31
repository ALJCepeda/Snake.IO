var socket = io();
var snakes = { };
var clients = [];
var food = { };

//Canvas stuff
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var width = ctx.offsetWidth;
var height = ctx.offsetHeight;
//Lets save the cell width in a variable for easy control
var cw = 10;
var score = 0;
var id = 0;

//This is where the server configures the client
//This is also where everything is initliazed
socket.on('configure', function(data) {
	id = data['id'];
	cw = data['cellWidth'];

	var pw = data['pointWidth'];

	canvas.width = width = cw * pw;
	canvas.height = height = cw * pw;

	update(data);
});

socket.on('iteration', function(data) {
	update(data);

	//Move all snakes
	gameIteration();

	//Redraw everything
	refreshCanvas();
});

socket.on('spawn', function(data) {
	//This is called whenever a client needs a new snake somewhere
	update(data);
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
	};
});

function gameIteration() {
	for(var clientid in snakes) {
		snakes[clientid].step();
	};

	var key = keypress.shift();

	if(key) {
		socket.emit('keydown', key); 
	};        
};

function refreshCanvas() {
	drawGrid();

	for(var foodid in food) {
		drawPoint(food[foodid], food[foodid].color);
	};
	
	for(var clientid in snakes) {
		drawSnake(snakes[clientid]);
	};
};

function drawSnake(snake) {
	for (var i = snake.body.length - 1; i >= 0; i--) {
		var part = snake.body[i];
		drawPoint(part, snake.color);
	};
};

function drawGrid() {
	//To avoid the snake trail we need to paint the BG on every frame
	//Lets paint the canvas now
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, width, height);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, width, height);

	//Lets paint the score
	var score_text = "Score: " + score;
	ctx.fillText(score_text, 5, height-5);
};

//Lets first create a generic function to paint points
function drawPoint(point, color) {
	var x = point.x;
	var y = point.y;

	ctx.fillStyle = color;
	ctx.fillRect(x*cw, y*cw, cw, cw);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*cw, y*cw, cw, cw);
};

function update(data) {
	if(data['collisions']) {
		process_collisions(data['collisions']);
	};

	if(data['ate']) {
		process_ate(data['ate']);
	};

	if(data['clients']) {
		update_clients(data['clients']);
	};

	if(data['food']) {
		update_food(data['food']);
	};
};

function process_ate(ate) {
	for( var clientid in ate ){
		snakes[clientid].pushTail();
		delete food[ate[clientid]];
	};
}

function process_collisions(collisions) {
	for (var i = collisions.length - 1; i >= 0; i--) {
		var clientid = collisions[i];
		delete snakes[clientid];

		console.log(clientid + ' collided with something');
	};	
}

function update_food(data) {
	for( var key in data ) {
		var point = new Point(data[key]['x'], data[key]['y']);
		point.color = data[key]['color'];

		food[key] = point;
	};
};

//The idea is to feed it generic client data, and for it for figure out what to do with it
function update_clients(data) {
	for( var clientid in data ) {
		//Attempt to update snake
		update_snake(clientid, data[clientid]);
	};
};

function update_snake(clientid, data) {
	//If server gave us a body, lets give the client a snake
	if(data['body']) {
		var snake = new Snake();
		for( var index in data['body'] ) {
			var coord = data['body'][index];
			var part = new Point(coord['x'], coord['y']);
			snake.pushPart(part);	
		};

		snakes[clientid] = snake;
		console.log('Created new snake for '+clientid);
	};

	//Otherwise check to see if snake exists before updating it's direction
	if(snakes[clientid]) {
		var snake = snakes[clientid];

		if(data['direction']) {
			snake.direction = data['direction'];
		};

		if(data['color']) {
			snake.color = data['color'];
		};
	};
};