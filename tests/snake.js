var assert = require('assert');
var Snake = require('./../public/scripts/snake.js');

describe('Snake', function() {
	describe('creation', function() {
		it('should create a 5 cell snake in the left direction', function() {
			var snake = Snake.create(5,5,5, 'left');
			var parts = snake.parts;

			assert.equal(snake.head.toString(), '(5,5)');
			assert.equal(parts[1].toString(), '(4,5)');
			assert.equal(parts[2].toString(), '(3,5)');
			assert.equal(parts[3].toString(), '(2,5)');
			assert.equal(snake.tail.toString(), '(1,5)');
		});
	});

	describe('mutation', function() {
		it('should add a head to the snake', function() {
			var snake = Snake.create(5,5,5, 'left');
			
			assert.equal(snake.head.toString(), '(5,5)');
			assert.equal(snake.tail.toString(), '(1,5)');
			assert.equal(snake.step().head.toString(), '(6,5)');

		});
	});
});