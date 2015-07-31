function Snake() {
	 this.body = [];
	 this.direction = '';
	 this.color = '';
	 this.points = {};
};

Object.defineProperty(Snake.prototype, 'head', {
	get:function() { return Snake.head(this); }
});
Object.defineProperty(Snake.prototype, 'tail', {
	get:function() { return Snake.tail(this); }
});
Object.defineProperty(Snake.prototype, 'next', {
	get:function() { return Snake.next(this); }
});
Snake.prototype.portable = function() { return Snake.portable(this); };
Snake.prototype.containsPoint = function(point) { return Snake.containsPoint(this, point); };
Snake.prototype.pushPart = function(point) { return Snake.pushPart(this, point); };
Snake.prototype.unshiftPart = function(point) { return Snake.unshiftPart(this, point); };
Snake.prototype.popTail = function() { return Snake.popTail(this); };
Snake.prototype.step = function() { return Snake.step(this); };
Snake.prototype.setDirection = function(direction) { this.direction = direction; return this; };

Snake.head = function(snake) { return snake.body[0]; };
Snake.tail = function(snake) { return snake.body[snake.body.length-1]; };
Snake.next = function(snake) { return snake.head.step(snake.direction); };

Snake.portable = function(snake) {
	return {
		body:snake.body,
		direction:snake.direction,
		color:snake.color
	};
};
Snake.popTail = function(snake) { 
	var tail = snake.body.pop();

	if(tail !== undefined) {
		delete snake.points[tail.toString()];
	};

	return tail;
};
Snake.step = function(snake) { 
	snake.unshiftPart(snake.next).popTail();
	return snake;
};
Snake.unshiftPart = function(snake, point) {
	snake.body.unshift(point);
	snake.points[point.toString()] = point;
	return snake;
};
Snake.pushPart = function(snake, point) {
	snake.body.push(point);
	snake.points[point.toString()] = point;
	return snake;
};
Snake.containsPoint = function(snake, point) {
	return snake.points.hasOwnProperty(point.toString());
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = Snake;
};