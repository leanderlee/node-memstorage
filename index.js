var mongo = require("mongodb");

var Store = function (options) {
	options = options || {};
	options.type = options.type || "memory";
	options.settings = options.settings || {};

	try {
		var store = require("./lib/" + options.type);
	} catch (e) {
		return null;
	}
	return new store(options.settings);
}

module.exports = Store;
