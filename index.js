
var Store = function (options) {
	options = options || {};
	options.type = options.type || "memory";
	options.settings = options.settings || {};	
	try {
		return require("./lib/" + options.type)(options.settings);
	} catch (e) {
		console.log("Could not find the type you wanted.");
		return null;
	}
}

module.exports = Store;
