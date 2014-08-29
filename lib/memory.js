
var MemoryStorage = function (options) {
  options = options || {};
  var self = {};
  var indices = {};
  var uuid = 1;
  var refs = {};
  var indexrefs = {};
  var nullOnMiss = options.nullOnMiss || false;
  var includeKey = options.includeKey || false;
  var permuteOnSet = (options.permute === undefined ? true : !!options.permute);
  
  var get = function (key) {
    if (typeof(key) == "string") {
      return key;
    }
    var str = "";
    var keys = Object.keys(key);
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
      str += keys[i] + ";" + key[keys[i]];
    }
    return str;
  };

  var permutation = function (collection) {
      var current, subarray;
      var result = [];
      var currentArray = [];
      var newResultArray = [];
      if (collection.length){
          current = collection.shift();
          result = permutation(collection);
   
          currentArray.push(current);
   
          result.map(function(list) {
              newResultArray.push(list.slice(0));
              list.push(current);
          });
   
          result.push(currentArray);
          result = result.concat(newResultArray);
      }
      return result;
  };
  var permute = function (key) {
    if (typeof(key) == "string") {
      return [key];
    }
    var perms = permutation(Object.keys(key)).map(function (all) {
      var obj = {};
      all.sort();
      for (var i = 0; i < all.length; i++) {
        obj[all[i]] = key[all[i]];
      }
      return get(obj);
    });
    return perms;
  };

  self.get = function (key, cb) {
    cb = cb || function () {};
    var id = get(key);
    var matches = indices[id];
    if (!matches) return cb(nullOnMiss ? null : []);
    if (!permuteOnSet) return cb(matches);
    var result = [];
    for (var unique in matches) {
      result.push(matches[unique]);
    }
    cb(result);
  }

  self.set = function (key, val, cb) {
    cb = cb || function () {};
    var id = get(key);
    if (includeKey) {
      val = { key: key, val: val };
    }
    if (indices[id]) {
      var unique = Object.keys(indices[id])[0];
      var ids = refs[unique];
      for (var i = 0; i < ids.length; i++) {
        indices[ids[i]] = indices[ids[i]] || {};
        indices[ids[i]][unique] = val;
      }
    } else if (permuteOnSet) {
      var ids = permute(key);
      var unique = uuid;
      uuid++;
      refs[unique] = ids;
      for (var i = 0; i < ids.length; i++) {
        indices[ids[i]] = indices[ids[i]] || {};
        indices[ids[i]][unique] = val;
      }
    } else {
      indices[id] = val;
    }
    cb();
  }

  self.del = function (key, cb) {
    cb = cb || function () {};
    var id = get(key);
    if (!indices[id]) return cb();
    var matches = indices[id];
    if (!permuteOnSet) {
      delete indices[id];
    } else {
      for (var unique in matches) {
        var ids = refs[unique];
        if (!ids) continue;
        for (var j = 0; j < ids.length; j++) {
          if (indices[ids[j]]) {
            delete indices[ids[j]][unique];
          }
          if (!Object.keys(indices[ids[j]]).length) {
            delete indices[ids[j]];
          }
        }
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
