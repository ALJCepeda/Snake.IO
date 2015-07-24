function Snake(head, direction) {
	 this.body = head.walk(opposite(direction));
	 this.direction = direction;
}

Object.defineProperty(Snake.prototype, 'length', {
	get:function() { return Snake.length(this); }
});
Object.defineProperty(Snake.prototype, 'head', {
	get:function() { return Snake.head(this); }
});
Object.defineProperty(Snake.prototype, 'tail', {
	get:function() { return Snake.tail(this); }
});

Snake.prototype.next = function() { return Snake.next(this); };
Snake.prototype.addHead = function() { return Snake.addHead(this); };
Snake.prototype.popTail = function() { return Snake.popTail(this); };
Snake.prototype.step = function() { return Snake.step(this); };

Snake.length = function(snake) { return snake.body.length; };
Snake.head = function(snake) { return snake.body[0]; };
Snake.tail = function(snake) { return snake.body[snake.length-1]; };

Snake.next = function(snake) { return snake.head.step(snake.direction); };
Snake.addHead = function(snake) { snake.body.unshift(snake.next); return snake; };
Snake.popTail = function(snake) { return snake.body.pop(); };
Snake.step = function(snake) { 
	snake.addHead();
	snake.popTail();
	return snake;
};

function opposite(direction) {
	var cases = {
		up:'down', down:'up',
		left:'right',right:'left'
	};

	return cases[direction] || '';
}