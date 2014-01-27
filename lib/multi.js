
var Store = require("../index");

var MultiStorage = function (options) {
  var self = {};

  var stores = [];
  var settings = options.stores || [];
  for (var i = 0; i < settings.length; i++) {
    try {
      var store = Store(settings[i]);
      if (store) stores.push(store);
    } catch (e) {}
  }

  var iterator = function (fn) {
    self[fn] = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      var returned = 0;
      var called = 0;
      var done = function () {
        returned++;
        if (returned == called) cb();
      }
      var cb = function(){};
      if (typeof(args[args.length-1]) == "function") {
        cb = args.pop();
      }
      args.push(done);
      for (var i = 0; i < stores.length; i++) {
        if (stores[i] && stores[i][fn]) {
          called++;
        }
      }
      for (var i = 0; i < stores.length; i++) {
        if (stores[i] && stores[i][fn]) {
          stores[i][fn].apply(null, args);
        }
      }
    }
  }

  self.get = function (key, cb) {
    if (!stores.length) return cb([]);
    stores[0].get(key, cb);
  }

  var functions = ["set", "del", "connect"];
  functions.forEach(iterator);

  return self;
}

if (module && module.exports) module.exports = MultiStorage;
