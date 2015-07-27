var socket = io();
var snakes = { };

$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	//Lets save the cell width in a variable for easy control
	var cw = 10;
	var score = 0;
	var id = 0;

	//This is where the server configures the client
	//This is also where everything is initliazed
	socket.on('configure', function(data) {
		id = data['id'];
		console.log("Received id: "+id);
	});

	socket.on('update', function(data) {
		if(data['clients']) {
			updateSnakes(data['clients']);	
		}

		gameIteration();
		refreshCanvas();
	});
	
	//Lets add the keyboard controls now
	var lockKey = { };
	$(document).keydown(function(e) {
		var key = e.which;
		var cases = [37,38,39,40];

		if(	cases.indexOf(key) != -1  &&  lockKey[key] !== true  &&  Utility.direction_fromKeycode(key) != snakes[id].direction ) {
			lockKey[key] = true;

			//The direction change will be applied on the server's next iteration
			socket.emit('keydown', key);
		}
	});

	$(document).keyup(function(e) {
		var key = e.which;

		if(lockKey[key] === true) {
			lockKey[key] = false;
		}
	})
	
	function gameIteration() {
		for(var clientid in snakes) {
			var snake = snakes[clientid];
			snake.step();
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
			drawPoint(part);
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
	function drawPoint(point) {
		var x = point.x;
		var y = point.y;

		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	function timeSince_UTC(startTime) {
		var clientTime = new Date((new Date().toUTCString())).getTime();
		var timeSince = clientTime - startTime;

		//There's something weird going on where the time difference will deviate by whole seconds
		//While it's not unusual for the client/server clocks to deviate from each other, it's very
		//unlikely that they will consistently deviate by whole seconds.
		//Ignoring these values doesn't seem to impose any issues on the synchronization
		//We'll keep track of whenever the client is forced to resync to see if this causes us problems
		return (timeSince % 1000 == 0) ? 0 : timeSince;
	}

	function updateSnakes(clients) {
		for( var clientid in clients ) {
			var info = clients[clientid];

			if(!snakes[clientid]) {
				snakes[clientid] = new Snake();
			}

			if(info['direction']) {
				snakes[clientid].direction = info['direction'];
			}

			if(info['body']) {
				var body = [];
				for (var i = info['body'].length - 1; i >= 0; i--) {
					var part = info['body'][i];
					part = new Point(part.x, part.y);
					body[i] = part;
				}

				snakes[clientid].body = body
			}
		}
	}
});