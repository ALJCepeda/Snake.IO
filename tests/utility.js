var assert = require('assert');
var Utility = require('./../public/scripts/utility.js');

describe('Utility', function() {
	describe('general', function() {
		it('should check if object has no properties', function() {
			var object = {};

			assert.equal(object.isEmpty, true);

			object['foo'] = 'bar';
			assert.equal(object.isEmpty, false);

			delete object['foo'];
			assert.equal(object.isEmpty, true);

			object.foo = 'bar';
			assert.equal(object.isEmpty, false);
		});

		it('should return the direction represented by the keycode', function() {
			assert.equal(Utility.direction_fromKeycode(37), 'left');
			assert.equal(Utility.direction_fromKeycode(38), 'up');
			assert.equal(Utility.direction_fromKeycode(39), 'right');
			assert.equal(Utility.direction_fromKeycode(40), 'down');
		})
	});
});	