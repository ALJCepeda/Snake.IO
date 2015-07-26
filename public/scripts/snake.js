function Snake() {
	 this.body = [];
	 this.direction;
}

Object.defineProperty(Snake.prototype, 'head', {
	get:function() { return Snake.head(this); }
});
Object.defineProperty(Snake.prototype, 'tail', {
	get:function() { return Snake.tail(this); }
});
Object.defineProperty(Snake.prototype, 'next', {
	get:function() { return Snake.next(this); }
})
Snake.prototype.portable = function() { return Snake.portable(this); };
Snake.prototype.addHead = function() { return Snake.addHead(this); };
Snake.prototype.popTail = function() { return Snake.popTail(this); };
Snake.prototype.step = function() { return Snake.step(this); };
Snake.prototype.setDirection = function(direction) { this.direction = direction; return this; };

Snake.spawnSize = 4;
Snake.head = function(snake) { return snake.body[0]; };
Snake.tail = function(snake) { return snake.body[snake.body.length-1]; };
Snake.next = function(snake) { return snake.head.step(snake.direction); };

Snake.portable = function(snake) {
	return {
		body:snake.body,
		direction:snake.direction
	};
};
Snake.addHead = function(snake) { snake.body.unshift(snake.next); return snake; };
Snake.popTail = function(snake) { return snake.body.pop(); };
Snake.step = function(snake) { 
	snake.addHead().popTail();
	return snake;
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = Snake;
}