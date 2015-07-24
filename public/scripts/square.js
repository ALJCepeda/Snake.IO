var inExpress = (typeof module !== "undefined" && module.exports);
if (inExpress) {
    var Point = require('./point.js');
}

function Square(x, y, width) {
	this.origin = new Point(x, y);
	this.width = width;
}

Square.create_centerAt = function(point, width) {
	return new Square(point.x, point.y, width);
}
Square.contains = function(square, poly) {
	if(typeof poly === 'Point') {
		return Square.contains_point(square, poly);
	}
}

Square.contains_point = function(square, point) {
	return (square.origin.x < point.x) && ((square.origin.x + square.width) > point.x) &&
			(square.y < point.y) && ((square.y + square.length) > point.y);
}
Square.contains_square = function(larger, smaller) {
	return (larger.origin.x <= smaller.x) && (larger.origin.x + larger.width) >= smaller) &&
			(larger.origin.y <= smaller.y) && (larger.origin.y + larger.width) >= smaller);
}

if (inExpress) {
    module.exports = Square;
}