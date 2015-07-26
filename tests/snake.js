var assert = require('assert');
var Point = require('./../public/scripts/point.js');
var Snake = require('./../public/scripts/snake.js');

describe('Snake', function() {
	describe('creation', function() {
		it('should create a 5 cell snake in the left direction', function() {
			var head = new Point(5, 5);
			var snake = new Snake(head, 'right', 5);
			var body = snake.body;

			assert.equal(snake.head.toString(), '(5,5)');
			assert.equal(body[1].toString(), '(4,5)');
			assert.equal(body[2].toString(), '(3,5)');
			assert.equal(body[3].toString(), '(2,5)');
			assert.equal(snake.tail.toString(), '(1,5)');
			
			assert.equal(snake.next.toString(), '(6,5)');
			assert.equal(snake.body.length, 5);
		});
	});


	describe('mutation', function() {
		it('should add a head to the snake', function() {
			var head = new Point(5, 5);
			var snake = new Snake(head, 'right', 5);
			
			assert.equal(snake.head.toString(), '(5,5)');
			assert.equal(snake.tail.toString(), '(1,5)');
			assert.equal(snake.body.length, 5);
			assert.equal(snake.next.toString(), '(6,5)');

			snake.addHead();

			assert.equal(snake.head.toString(), '(6,5)');
			assert.equal(snake.tail.toString(), '(1,5)');
			assert.equal(snake.body.length, 6);

			snake.direction = 'down';
			snake.addHead().addHead();

			assert.equal(snake.head.toString(), '(6,7)');
			assert.equal(snake.tail.toString(), '(1,5)');
			assert.equal(snake.body.length, 8);
		});

		it('should move snake in the right direction', function() {
			var head = new Point(5, 5);
			var snake = new Snake(head, 'right', 5);

			snake.step();

			assert.equal(snake.head.toString(), '(6,5)');
			assert.equal(snake.tail.toString(), '(2,5)');
			assert.equal(snake.body.length, 5);

			snake.direction = 'left';
			snake.step().step();

			assert.equal(snake.head.toString(), '(4,5)');
			assert.equal(snake.tail.toString(), '(4,5)');
			assert.equal(snake.body.length, 5);
		})
	});
});