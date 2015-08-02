var assert = require('assert');
var Point = require('./../resources/scripts/point.js');
var Snake = require('./../resources/scripts/snake.js');
var Utility = require('./../resources/scripts/utility.js');

describe('Snake', function() {
	describe('creation', function() {
		it('should create a 5 cell snake in the left direction', function() {
			var direction = 'right';
			var opposite = 'left';
			var body = (new Point(5,5)).walk(opposite, 4);

			var snake = new Snake();
			for( var part in body ) {
				snake.pushPart(body[part]);
			}
			snake.direction = direction;

			assert.equal(snake.head.toString(), '(5,5)');
			assert.equal(snake.body[0].toString(), '(5,5)');
			assert.equal(snake.body[1].toString(), '(4,5)');
			assert.equal(snake.body[2].toString(), '(3,5)');
			assert.equal(snake.body[3].toString(), '(2,5)');
			assert.equal(snake.body[4].toString(), '(1,5)');
			assert.equal(snake.tail.toString(), '(1,5)');
			
			assert.equal(snake.next.toString(), '(6,5)');
			assert.equal(snake.body.length, 5);
		});
	});


	describe('mutation', function() {
		it('should add a head to the snake', function() {
			var direction = 'right';
			var opposite = 'left'
			var body = (new Point(5,5)).walk(opposite, 4);

			var snake = new Snake();
			for( var part in body ) {
				snake.pushPart(body[part]);
			}
			snake.direction = direction;
			
			assert.equal(snake.head.toString(), '(5,5)');
			assert.equal(snake.tail.toString(), '(1,5)');
			assert.equal(snake.body.length, 5);
			assert.equal(snake.next.toString(), '(6,5)');

			snake.unshiftPart(snake.next);

			assert.equal(snake.head.toString(), '(6,5)');
			assert.equal(snake.tail.toString(), '(1,5)');
			assert.equal(snake.body.length, 6);

			snake.direction = 'down';
			snake.unshiftPart(snake.next).unshiftPart(snake.next);

			assert.equal(snake.head.toString(), '(6,7)');
			assert.equal(snake.tail.toString(), '(1,5)');
			assert.equal(snake.body.length, 8);
		});

		it('should move snake in the right direction', function() {
			var direction = 'right';
			var opposite = 'left';
			var body = (new Point(5,5)).walk(opposite, 4);

			var snake = new Snake();
			for( var part in body ) {
				snake.pushPart(body[part]);
			}
			snake.direction = direction;

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