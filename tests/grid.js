var assert = require('assert');
var Grid = require('./../public/scripts/grid.js');
var Point = require('./../public/scripts/point.js');

describe('Grid', function() {
	describe('generation', function() {
		it('should create a 500x500 grid', function() {
			var grid = new Grid();
			grid.pointWidth = 50;
			grid.cellWidth = 10;

			assert.equal(grid.htmlWidth(), 500);
		});
	});

	describe('bound check', function() {
		it('should have points within bounds', function() {
			var grid = new Grid();
			grid.pointWidth = 50;
			grid.cellWidth = 10;

			assert.equal(grid.containsPoint(new Point(0,0)), true);
			assert.equal(grid.containsPoint(new Point(25,25)), true);
			assert.equal(grid.containsPoint(new Point(49,49)), true);
			
		});

		it('should have points outside bounds', function() {
			var grid = new Grid();
			grid.pointWidth = 50;
			grid.cellWidth = 10;
			assert.equal(grid.containsPoint(new Point(-1,0)), false);
			assert.equal(grid.containsPoint(new Point(49,50)), false);
		});
	})
});