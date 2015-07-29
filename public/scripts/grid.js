function Grid() {
	this.pointWidth = 50; //The pixel width is determined by the cell width
	this.cellWidth = 10; //In pixels, this will determine the total htmlWidth

	this.food = {};
}

Grid.prototype.containsPoint = function(point) { return Grid.containsPoint(this, point); };
Grid.prototype.htmlWidth = function() { return Grid.htmlWidth(this); };
Grid.prototype.addFood = function(point) { return Grid.addFood(this, point); };
Grid.prototype.removeFood = function(point) { return Grid.removeFood(this, point); };
Grid.prototype.hasFood = function(point) { return Grid.hasFood(this, point); };

Grid.addFood = function(grid, point) {
	grid.food[point.toString()] = true;
	return this;
};
Grid.removeFood = function(grid, point) {
	if(grid.hasFood(point)) {
		delete grid.food[point.toString()];
		return true;
	}

	return false;
};
Grid.hasFood = function(grid, point) {
	return grid.food[point.toString()] === true;
};

Grid.containsPoint = function(grid, point) {
	return point.x >= 0 && point.y >= 0 && point.x < grid.pointWidth && point.y < grid.pointWidth;
};
Grid.htmlWidth = function(grid) {
	return grid.pointWidth * grid.cellWidth;
};	

if (typeof module !== "undefined" && module.exports) {
    module.exports = Grid;
}