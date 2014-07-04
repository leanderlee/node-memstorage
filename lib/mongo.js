var mongo = require("mongodb");

var MongoStorage = function (options) {
  options = options || {};
  var host = options.host || "localhost";
  var port = options.port || 27017;
  var user = options.user || "";
  var pass = options.pass || "";
  var db = options.db || "";
  var hosts = options.hosts || host + ":" + port;
  var replicaset = options.replicaset || false;
  var collectionName = options.collectionName || "";
  var nullOnMiss = options.nullOnMiss || "";
  var settings = options.options || { auto_reconnect: true, poolSize: 1, fsync: true, safe: true };
  var self = {};
  var conn = null;

  var idize = function (key, prefix, filter) {
    if (typeof(key) == "object") {
      for (var i in key) {
        idize(key[i], prefix + "." + i, filter);
      }
    } else {
      filter[prefix] = key;
    }
    return filter;
  }

  self.get = function (key, cb) {
    cb = cb || function () {};
    conn.collection(collectionName, function (err, collection) {
      var filter = idize(key, "_id", {});
      var empty = true;
      for (var i in filter) {
        empty = false;
        break;
      }
      if (empty) return cb([]);
      collection.find(filter, { _id: false }, function (err, cursor) {
        cursor.toArray(function (err, docs) {
          if (err) {
            return cb(nullOnMiss ? null : []);
          } else {
            docs = docs.map(function (x) {
              return x.val;
            })
            if (docs.length) {
              cb(docs);
            } else {
              cb(nullOnMiss ? null : []);
            }
          }
        });
      });
    });
  }

  self.set = function (key, val, cb) {
    cb = cb || function () {};
    conn.collection(collectionName, function (err, collection) {
      val = { val: val };
      val._id = key;
      collection.update({ _id: key }, val, { safe: true, upsert: true, multi: false }, cb);
    });
  }

  self.del = function (key, cb) {
    cb = cb || function () {};
    conn.collection(collectionName, function (err, collection) {
      var filter = idize(key, "_id", {});
      var empty = true;
      for (var i in filter) {
        empty = false;
        break;
      }
      if (empty) return cb();
      collection.remove(filter, { safe: true, upsert: false, multi: true }, cb);
    });
  }

  self.connect = function (cb) {
    cb = cb || function () {};
    var mongoConnectStr = "mongodb://";
    if (user) {
      mongoConnectStr += user + ":" + pass + "@";
    } 
    mongoConnectStr += hosts + "/" + db + "?w=1&readPreference=secondaryPreferred";
    if (replicaset) {
      mongoConnectStr += "&replicaSet=" + replicaset;
    }

    var mongoClient = new mongo.MongoClient;
    try{
      mongoClient.connect(mongoConnectStr, function(err, connecteddb) {
        conn = connecteddb;
        cb(true);
      });
    } catch (e) {
      return cb(false);
    }
  }

  return self;

}

if (module && module.exports) module.exports = MongoStorage;
