function Point(x, y) {
	this.x = x;
	this.y = y;

	this.toString = function() { return Point.toString(this); };
	this.left = function() { return Point.left(this); };
	this.right = function() { return Point.right(this); };
	this.up = function() { return Point.up(this); };
	this.down = function() { return Point.down(this); };
	this.walk = function(direction, length) { return Point.walk(this, direction, length); };
}

Point.left = function(point) {
	return new Point(point.x - 1, point.y);
};
Point.right = function(point) {
	return new Point(point.x + 1, point.y);
};
Point.down = function(point) {
	return new Point(point.x, point.y + 1);
};
Point.up = function(point) {
	return new Point(point.x, point.y - 1);
};
Point.walk = function(point, direction, length) {
	var next;
	var points = [];

	var cases = {
		up: function() { return Point.up; },
		down: function() { return Point.down; },
		left: function() { return Point.left; },
		right: function() { return Point.right; }
	}

	if(cases[direction]) {
		next = cases[direction]();
	} else {
		return points;
	}

	for(var i=0; i < length; i++){
		point = next(point);
		points.push(point);
	}

	return points;
};
Point.toString = function(point) {
	return '('+point.x+','+point.y+')';
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = Point;
}