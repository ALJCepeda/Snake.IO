function Point(x, y) {
	this.x = x;
	this.y = y;
}

Point.prototype.toString = function() { return Point.toString(this); };
Point.prototype.left = function() { return Point.left(this); };
Point.prototype.right = function() { return Point.right(this); };
Point.prototype.up = function() { return Point.up(this); };
Point.prototype.down = function() { return Point.down(this); };
Point.prototype.step = function(direction) { return Point.step(this, direction); };
Point.prototype.walk = function(direction, length) { return Point.walk(this, direction, length); };
Point.prototype.equals = function(point) { return Point.equals(this, point); };

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
Point.step = function(point, direction) {
	return Point.action(direction)(point);
}
Point.walk = function(point, direction, length) {
	var next = Point.action(direction);
	var points = [point];

	for(var i=0; i < length; i++){
		point = next(point);
		points.push(point);
	}

	return points;
};
Point.action = function(direction) {
	var cases = {
		up: Point.up,
		down: Point.down,
		left: Point.left,
		right: Point.right
	}

	var action = cases[direction] || '';
	if(!action) {
		throw {
			name: 'Bad Argument',
			status: 'fatal', 
			message: 'Unrecognized direction: ' + direction
		};
	}

	return action;
}
Point.toString = function(point) {
	return '('+point.x+','+point.y+')';
}
Point.equals = function(a, b) {
	return (a.x === b.x) && (a.y === b.y);
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = Point;
}