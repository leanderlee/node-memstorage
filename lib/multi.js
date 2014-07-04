
var Store = require("../index");

var MultiStorage = function (options) {
  options = options || {};
  var self = {};

  var stores = [];
  var nullOnMiss = options.nullOnMiss || false;
  var settings = options.stores || [];
  for (var i = 0; i < settings.length; i++) {
    try {
      settings[i].settings = settings[i].settings || {};
      settings[i].settings.nullOnMiss = true;
      var store = Store(settings[i]);
      if (store) stores.push(store);
    } catch (e) {}
  }

  var iterator = function (fn) {
    self[fn] = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      var returned = 0;
      var called = 0;
      var cb = function(){};
      var done = function () {
        returned++;
        if (returned == called) cb();
      }
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
    var current = 0;
    var attempt = function () {
      if (current >= stores.length) {
        return cb(nullOnMiss ? null : []);
      }
      stores[current].get(key, function (v) {
        if (v === null) {
          (setImmediate || process.nextTick)(function () {
            current++;
            attempt();
          })
        } else {
          cb(v);
        }
      })
    }
    attempt();
  }

  var functions = ["set", "del", "connect"];
  functions.forEach(iterator);

  return self;
}

if (module && module.exports) module.exports = MultiStorage;
