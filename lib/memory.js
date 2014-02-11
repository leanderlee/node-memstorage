
var MemoryStorage = function (options) {
  var self = {};
  var indices = {};
  var uuid = 1;
  var refs = {};

  var idize = function (key) {
    if (typeof(key) == "string") {
      key = { _string: key, val: "*" };
    }
    var result = [];
    for (var id in key) {
      if (typeof(key[id]) == "object") {
        var sub = idize(key[id]);
        for (var i = 0; i < sub.length; i++) {
          result.push({ key: id + "." + sub[i].key, val: sub[i].val });
        }
      } else {
        result.push({ key: id, val: key[id]+"" });
      }
    }
    return result;
  };

  self.get = function (key, cb) {
    cb = cb || function () {};
    var ids = idize(key);
    if (!ids.length) return cb([]);
    var result = [];
    if (indices[ids[0].key] && indices[ids[0].key][ids[0].val]) {
      result = indices[ids[0].key][ids[0].val];
    }
    for (var i = 1; i < ids.length; i++) {
      if (!indices[ids[i].key] ||
          !indices[ids[i].key][ids[i].val]) return cb([]);
        result = indices[ids[i].key][ids[i].val].filter(function (x) {
          return result.indexOf(x) >= 0;
        })
    }
    result = result.map(function (x) { return x.val });
    cb(result);
  }

  self.set = function (key, val, cb) {
    cb = cb || function () {};
    var ids = idize(key);
    val = { val: val, uuid: uuid };
    refs[uuid] = ids.map(function (x) { x.obj = val; return x });
    uuid++;
    for (var i = 0; i < ids.length; i++) {
      indices[ids[i].key] = indices[ids[i].key] || {};
      indices[ids[i].key][ids[i].val] = indices[ids[i].key][ids[i].val] || [];
      if (indices[ids[i].key][ids[i].val].indexOf(val) == -1) {
        indices[ids[i].key][ids[i].val].push(val);
      }
    }
    cb();
  }

  self.del = function (key, cb) {
    cb = cb || function () {};
    var ids = idize(key);
    for (var i = 0; i < ids.length; i++) {
      if (!indices[ids[i].key] || !indices[ids[i].key][ids[i].val]) continue;
      for (var j = 0; j < indices[ids[i].key][ids[i].val].length; j++) {
        if (!indices[ids[i].key][ids[i].val][j].uuid) continue;
        var uuid = indices[ids[i].key][ids[i].val][j].uuid;
        if (!refs[uuid]) continue;
        for (var k = 0; k < refs[uuid].length; k++) {
          if (!indices[refs[uuid][k].key][refs[uuid][k].val]) continue;
          var pos = indices[refs[uuid][k].key][refs[uuid][k].val].indexOf(refs[uuid][k].obj);
          if (pos != -1 && refs[uuid][k].key != ids[i].key) {
            indices[refs[uuid][k].key][refs[uuid][k].val].splice(pos, 1);
          }
        }
        indices[ids[i].key][ids[i].val].splice(j, 1); j--;
        delete refs[uuid];
      }
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
