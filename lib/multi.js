
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
      var v = 0;
      var done = function () {
        v--;
        if (v == 0) cb();
      }
      cb = args.pop() || function(){};
      args.push(done);
      for (var i = 0; i < stores.length; i++) {
        v++;
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
