function Grid(width, height, cellWidth) {
	this.width = width;
	this.height = height;
	this.cell_width = cellWidth;
	this.pixel_width = width * cellWidth;
	this.pixel_height = height * cellWidth;
}

Grid.prototype.contains_point = function(point) {
	return Grid.contains_point(this, point);
}

Grid.contains_point = function(grid, point) {
	return (point.x >= 0 && point.y >= 0) && (point.x < grid.width && point.y < grid.height);
}