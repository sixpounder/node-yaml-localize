/**
 * Utility class to store key/values of translation (quicker access, avoids obj parsing)
 */
var _store = new function() {
	this.map = {};

	this.get = function(key) {
		if (key in this.map) {
			return this.map[key];
		} else {
			return null;
		}
	};

	this.set = function(key, value) {
		this.map[key] = value;
	};
}

module.exports = _store;