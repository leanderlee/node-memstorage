
var Store = require("../index");

var MultiStorage = function (options) {
  options = options || {};
  var self = {};

  var stores = [];
  var cache = !!options.cache;
  var nullOnMiss = options.nullOnMiss || false;
  var settings = options.stores || [];
  if (cache) {
    var memcache = Store({ type: "memory" });
  }
  for (var i = 0; i < settings.length; i++) {
    settings[i].settings = settings[i].settings || {};
    settings[i].settings.nullOnMiss = true;
    if (settings[i].type != "memory") {
      var store = Store(settings[i]);
      if (store) {
        stores.push(store);
      }
    }
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
    if (cache) return memcache.get(key, cb);
    var attempt = function () {
      if (current >= stores.length) {
        return cb(nullOnMiss ? null : []);
      }
      stores[current].get(key, function (v) {
        if (v === null) {
          process.nextTick(function () {
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

  var _connect = self.connect;
  var _del = self.del;
  var _set = self.set;
  if (cache) {
    self.connect = function (cb) {
      _connect(function () {
        var current = stores.length;
        var copyNext = function () {
          current--;
          if (current < 0) return cb();
          stores[current].copy(memcache, function () {
            copyNext();
          })
        }
        copyNext();
      })
    }
    self.del = function (key, cb) {
      _del(key, function () {
        memcache.del(key, cb);
      })
    }
    self.set = function (key, val, cb) {
      _set(key, val, function () {
        memcache.set(key, val, cb);
      })
    }
  }

  return self;
}

if (module && module.exports) module.exports = MultiStorage;
