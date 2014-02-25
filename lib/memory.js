
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

  var find = function (ids) {
    var results;
    for (var i = 0; i < ids.length; i++) {
      if (!indices[ids[i].key]) continue;
      if (!indices[ids[i].key][ids[i].val]) {
        // Nothing Matched.
        results = [];
        break;
      }
      var matches = [];
      for (var j = 0; j < indices[ids[i].key][ids[i].val].length; j++) {
        if (!indices[ids[i].key][ids[i].val][j].uuid) continue;
        var uuid = indices[ids[i].key][ids[i].val][j].uuid;
        if (results === undefined || results.indexOf(uuid) > -1) {
          matches.push(uuid);
        }
      }
      results = matches;
      if (!results.length) {
        // Nothing Matched.
        break;
      }
    }
    if (!results) return [];
    return results;
  }

  self.get = function (key, cb) {
    cb = cb || function () {};
    var ids = idize(key);
    var matches = find(ids);
    var result = [];
    if (!matches.length) return cb([]);
    for (var i = 0; i < matches.length; i++) {
      if (refs[matches[i]] && refs[matches[i]].length) {
        result.push(refs[matches[i]][0].obj.val);
      }
    }
    cb(result);
  }

  self.set = function (key, val, cb) {
    cb = cb || function () {};
    var ids = idize(key);
    var matches = find(ids);
    if (matches.length && refs[matches[0]] && refs[matches[0]].length) {
      // Update
      var id = matches[0];
      var old = refs[id][0].obj;
      var val = { val: val, uuid: id };
      for (var i = 0; i < ids.length; i++) {
        indices[ids[i].key] = indices[ids[i].key] || {};
        indices[ids[i].key][ids[i].val] = indices[ids[i].key][ids[i].val] || [];
        var pos = indices[ids[i].key][ids[i].val].indexOf(old);
        if (pos == -1) {
          indices[ids[i].key][ids[i].val].push(val);
        } else {
          indices[ids[i].key][ids[i].val][pos] = val;
        }
      }
    } else {
      // Insert
      id = uuid;
      uuid++;
      val = { val: val, uuid: id };
      refs[id] = ids.map(function (x) { x.obj = val; return x });
      for (var i = 0; i < ids.length; i++) {
        indices[ids[i].key] = indices[ids[i].key] || {};
        indices[ids[i].key][ids[i].val] = indices[ids[i].key][ids[i].val] || [];
        indices[ids[i].key][ids[i].val].push(val);
      }
    }
    cb();
  }

  self.del = function (key, cb) {
    cb = cb || function () {};
    var ids = idize(key);
    var suspects = find(ids);
    if (!suspects.length) return cb();

    // Delete all suspects
    for (var i = 0; i < suspects.length; i++) {
      var uuid = suspects[i];
      if (!refs[uuid]) continue;
      for (var k = 0; k < refs[uuid].length; k++) {
        if (!indices[refs[uuid][k].key][refs[uuid][k].val]) continue;
        var pos = indices[refs[uuid][k].key][refs[uuid][k].val].indexOf(refs[uuid][k].obj);
        if (pos != -1) {
          indices[refs[uuid][k].key][refs[uuid][k].val].splice(pos, 1);
        }
      }
      delete refs[uuid];
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
