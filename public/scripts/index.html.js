var socket = io();		
$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	//Lets save the cell width in a variable for easy control
	var cw = 10;
	var d;
	var food;
	var score;

	/* Client has spawned in the game*/
	socket.on('draw', function(data) {
		var cells = data['cells'];
		paint(cells);
	});
	
	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		var cases = [37,38,39,40];

		if(cases.indexOf(key) != -1) {
			socket.emit('keydown', key);
		}
	})
	
	//Lets paint the snake now
	function paint(cells) {
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		for (var i = cells.length - 1; i >= 0; i--) {
			var cell = cells[i];
			paint_cell(cell);
		};

		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
	}
	
	//Lets first create a generic function to paint cells
	function paint_cell(point) {
		var x = point.x;
		var y = point.y;

		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
});