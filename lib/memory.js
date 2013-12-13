
var MemoryStorage = function (options) {
  var self = {};
  var indices = {};

  var filter = function (key) {
    var result = [];
    if (typeof(key) == "object") {
      for (var id in key) {
        if (typeof(key[id]) == "object") {
          var sub = filter(key[id]);
          for (var i = 0; i < sub.length; i++) {
            result.push(id + "." + sub[i]);
          }
        } else {
          result.push(key[id]);
        }
      }
    } else {
      result = [key];
    }
    return result;
  };


  self.get = function (key, cb) {
    cb = cb || function () {};
    var ids = filter(key);
    var result = ids.length ? (indices[ids[0]] || []) : [];
    for (var i = 1; i < ids.length; i++) {
      if (!indices[ids[i]] || !indices[ids[i]].length) return cb([]);
      for (var k = 0; k < result.length; k++) {
        if (indices[ids[i]].indexOf(result[k]) == -1) {
          result.splice(k, 1); k--;
        }
      }
    }
    cb(result);
  }

  self.set = function (key, val, cb) {
    cb = cb || function () {};
    var ids = filter(key);
    for (var i = 0; i < ids.length; i++) {
      indices[ids[i]] = indices[ids[i]] || [];
      if (indices[ids[i]].indexOf(val) == -1) {
        indices[ids[i]].push(val);
      }
    }
    cb();
  }

  self.del = function (key, cb) {
    cb = cb || function () {};
    var ids = filter(key);
    for (var i = 0; i < ids.length; i++) {
      delete indices[ids[i]];
    }
    cb();
  }

  self.connect = function (cb) {
    cb = cb || function () {};
    cb(true);
  }

  return self;

}

if (module && module.exports) module.exports = MemoryStorage;
