var socket = io();
var snakes = { };
var clients = [];
var food = { };

//Canvas stuff
var canvas = document.getElementById('canvas');
var content = document.getElementById('content');
var welcome = document.getElementById('welcome');
var again = document.getElementById('tryAgain');
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

	content.style.width = canvas.width = width = cw * pw;
	content.style.height = canvas.height = height = cw * pw;

	show_welcome();
	update(data);
});

welcome.addEventListener('click', function(e) {
	spawn_snake();
});
again.addEventListener('click', function(e) {
	spawn_snake();
});

function spawn_snake() {
	show_game();
	socket.emit('should_spawn');
};

function show_welcome() {
	canvas.style.display = 'none';
	welcome.style.display = 'inline-block';
	again.style.display = 'none';
};

function show_game() {
	canvas.style.display = 'inline-block';
	welcome.style.display = 'none';
	again.style.display = 'none';
}

function show_tryAgain() {
	canvas.style.display = 'none';
	welcome.style.display = 'none';
	again.style.display = 'inline-block';
}

socket.on('iteration', function(data) {
	update(data);

	//Move all snakes
	game_iteration();

	//Redraw everything
	refresh_canvas();
});

socket.on('spawn', function(data) {
	//This is called whenever a client needs a new snake somewhere
	update(data);
});

socket.on('disconnected', function(clientid) {
	delete snakes[clientid];
});

//Lets add the keyboard controls now

window.addEventListener('keydown', function(e) {
	pressed_button(e.which);
	e.preventDefault();
});
document.getElementById('leftBtn').addEventListener('click', function(e) {
	pressed_button(37);
});
document.getElementById('upBtn').addEventListener('click', function(e) {
	pressed_button(38);
});
document.getElementById('rightBtn').addEventListener('click', function(e) {
	pressed_button(39);
});
document.getElementById('downBtn').addEventListener('click', function(e) {
	pressed_button(40);
});

var keypress = [];
var lastKey = 0;
function pressed_button(keycode) {
	console.log(keycode);
	var cases = [37,38,39,40];
	if(	cases.indexOf(keycode) !== -1  &&  lastKey !== keycode ) {
		//The direction change will be applied on the server's next iteration
		keypress.push(keycode);
		lastKey = keycode;

	    return false;
	};
}

function game_iteration() {
	for(var clientid in snakes) {
		snakes[clientid].step();
	};

	var key = keypress.shift();

	if(key) {
		socket.emit('keydown', key); 
	};        
};

function refresh_canvas() {
	draw_grid();

	for(var foodid in food) {
		draw_point(food[foodid], food[foodid].color);
	};

	for(var clientid in snakes) {
		draw_snake(snakes[clientid]);
	};

	draw_score();
};

function draw_snake(snake) {
	for (var i = snake.body.length - 1; i >= 0; i--) {
		var part = snake.body[i];
		draw_point(part, snake.color);
	};
};

function draw_grid() {
	//To avoid the snake trail we need to paint the BG on every frame
	//Lets paint the canvas now
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, width, height);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, width, height);
};

function draw_score() {
	//Lets paint the score
	ctx.fillStyle = "blue";
	var score_text = "Score: " + score;
	ctx.font="15px Georgia";
	ctx.fillText(score_text, 5, height-5);
}

//Lets first create a generic function to paint points
function draw_point(point, color) {
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

		if(clientid == id) {
			score++;
		}
	};
}

function process_collisions(collisions) {
	for (var i = collisions.length - 1; i >= 0; i--) {
		var clientid = collisions[i];
		delete snakes[clientid];

		if(clientid === id) {
			show_tryAgain();
		}
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