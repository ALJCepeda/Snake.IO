function Utility() { }


Object.defineProperty(Object.prototype, 'isEmpty', {
  get: function() {
    for(var prop in this) {
		return false;
	}
	return true;
  }
});

Utility.direction_fromKeycode  = function (key) {
	var cases = {
		37:'left',
		38:'up',
		39:'right',
		40:'down'
	};

	return cases[key] || '';
};

Utility.direction_opposite = function (direction) {
	var cases = {
		up:'down', down:'up',
		left:'right',right:'left'
	};

	return cases[direction] || '';
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = Utility;
}