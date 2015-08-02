var assert = require('assert');
var Point = require('./../resources/scripts/point.js');

describe('Point', function() {
	describe('comparison', function() {
		it('should equal', function() {
			assert.equal(new Point(1,0).equals(new Point(1,0)), true);
		});
	});
	describe('steps', function() {
		it('should step left one space', function() {
			assert.equal(new Point(1,0).step('left').toString(), '(0,0)');
			assert.equal(new Point(0,0).left().toString(), '(-1,0)');
		});
		it('should step right one space', function() {
			assert.equal(new Point(-1,0).step('right').toString(), '(0,0)');
			assert.equal(new Point(0,0).right().toString(), '(1,0)');
		});
		it('should step up one space', function() {
			assert.equal(new Point(0,1).step('up').toString(), '(0,0)');
			assert.equal(new Point(0,0).up().toString(), '(0,-1)');
		});
		it('should step down one space', function() {
			assert.equal(new Point(0,-1).step('down').toString(), '(0,0)');
			assert.equal(new Point(0,0).down().toString(), '(0,1)');
		});
	});

	describe('movement', function() {
		it('should walk left 3 spaces', function () {
			var points = new Point(1,0).walk('left', 3);
			assert.equal(points[0].toString(), '(1,0)');
			assert.equal(points[1].toString(), '(0,0)');
			assert.equal(points[2].toString(), '(-1,0)');
			assert.equal(points[3].toString(), '(-2,0)');
		});
		it('should walk right 3 spaces', function() {
			var points = new Point(-2,0).walk('right', 3);
			assert.equal(points[0].toString(), '(-2,0)');
			assert.equal(points[1].toString(), '(-1,0)');
			assert.equal(points[2].toString(), '(0,0)');
			assert.equal(points[3].toString(), '(1,0)');
		});
		it('should walk up 3 spaces', function() {
			var points = new Point(0,2).walk('up', 3);
			assert.equal(points[0].toString(), '(0,2)');
			assert.equal(points[1].toString(), '(0,1)');
			assert.equal(points[2].toString(), '(0,0)');
			assert.equal(points[3].toString(), '(0,-1)');
		});
		it('should walk down 3 spaces', function() {
			var points = new Point(0,-1).walk('down', 3);
			assert.equal(points[0].toString(), '(0,-1)');
			assert.equal(points[1].toString(), '(0,0)');
			assert.equal(points[2].toString(), '(0,1)');
			assert.equal(points[3].toString(), '(0,2)');
		});
	})
});