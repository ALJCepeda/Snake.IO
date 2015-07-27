var socket = io();
var resyncs = 0;
var snakes = { };

$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	var timer = new Timer();
	timer.iteration = gameIteration;

	//Lets save the cell width in a variable for easy control
	var cw = 10;
	var score = 0;
	var id = 0;

	var updates = {};
	
	//This is where the server configures the client
	//This is also where everything is initliazed
	socket.on('configure', function(data) {
		id = data['id'];
		timer.count = data['iteration']['count'];
		timer.update(Timer.gameTick);

		updateTimer(data['iteration']);
		timer.start();
	});

	socket.on('update', function(data) {
		//Save update for later
		var count = data['iteration']['count'];
		updates[count] = data['clients'];

		//Force client to perform any missing iterations
		updateTimer(data['iteration']); 
	});
	
	socket.on('sync', function(data) {
		updateTimer(data['iteration']);
		updateSnakes(data['clients']);
	})
	//Lets add the keyboard controls now
	var lockKey = { };
	$(document).keydown(function(e) {
		var key = e.which;
		var cases = [37,38,39,40];

		if(		cases.indexOf(key) != -1 
			&&  lockKey[key] !== true 
			&&  Utility.direction_fromKeycode(key) != snakes[id].direction ) {
			var data = {};
			lockKey[key] = true;

			data['keycode'] = key;
			data['iteration'] = timer.portable();
			console.log("Position: " + snakes[id].head);

			//The direction change will be applied on the server's next iteration
			socket.emit('keydown', data);
		}
	});

	$(document).keyup(function(e) {
		var key = e.which;

		if(lockKey[key] === true) {
			lockKey[key] = false;
		}
	})

	function updateTimer(iteration) {
		var timeSince = timeSince_UTC(iteration['last']);
		//Client should always be behind the server by atleast one iteration
		var itersSince = (iteration['count'] - timer.count) - 1;

		console.log("Time since: " + timeSince);
		console.log("Iterations since: " + itersSince);

		if(timeSince > 0) {
			timer.update(Timer.gameTick - timeSince);
			timer.start();
		}
		

		if(itersSince < 0) {
			//Somehow the client progressed further than the server
			//We need to force the client to resync with the server
			socket.emit('sync', id);
		} else {
			//We need the client to catch up to the next update
			//We assume the client hasn't had a chance to undergo current iteration
			//For the client to catch up to the server
			for (var i = itersSince - 1; i >= 0; i--) {
				gameIteration();
				timer.count++;
			};
		}
	}
	
	function gameIteration() {
		for(var clientid in snakes) {
			var snake = snakes[clientid];
			snake.step();
		}

		if(updates[timer.count]) {
			updateSnakes(updates[timer.count]);	
			delete updates[timer.count];
		}                  

		refreshCanvas();
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
			var clientBody = clients[clientid]['snake']['body'];
			var direction = clients[clientid]['snake']['direction'];

			var body = [];
			for (var i = clientBody.length - 1; i >= 0; i--) {
				var part = clientBody[i];
				part = new Point(part.x, part.y);
				body[i] = part;
			}

			if(!snakes[clientid]) {
				snakes[clientid] = new Snake();
			}

			snakes[clientid].body = body;
			snakes[clientid].direction = direction;
		}
	}
});