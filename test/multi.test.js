var MultiStore = require("../lib/multi");
var MongoStore = require("../lib/mongo");
var assert = require("assert");

describe('MultiStorage', function(){
  describe('#set', function() {
    it("should insert properly", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-1" } };
      var settings2 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-2" } };
      var test = new MultiStore({ stores: [settings1, settings2] });
      var db1 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-1" });
      var db2 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-2" });
      test.connect(function () {
        db1.connect(function () {
          db2.connect(function () {
            test.set("x", 21, function() {
              db1.get("x", function (v) {
                assert.deepEqual(v, [21]);
                db2.get("x", function (v) {
                  assert.deepEqual(v, [21]);
                  done();
                })
              })
            })
          });
        });
      });
    })
  });
  describe('#del', function() {
    it("should delete properly", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-1" } };
      var settings2 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-2" } };
      var test = new MultiStore({ stores: [settings1, settings2] });
      var db1 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-1" });
      var db2 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-2" });
      test.connect(function () {
        db1.connect(function () {
          db2.connect(function () {
            test.set("x", 21, function() {
              test.del("x", function() {
                db1.get("x", function (v) {
                  assert.deepEqual(v, []);
                  db2.get("x", function (v) {
                    assert.deepEqual(v, []);
                    done();
                  })
                })
              })
            });
          });
        });
      });
    })
  });
  describe('#get', function() {
    it("should fetch from the first", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-1" } };
      var settings2 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-2" } };
      var test = new MultiStore({ stores: [settings1, settings2] });
      var db1 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-1" });
      var db2 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-2" });
      test.connect(function () {
        db1.connect(function () {
          db2.connect(function () {
            test.del("x", function() {
              db1.set("x", 21, function() {
                db2.set("x", 24, function() {
                  test.get("x", function(v) {
                    assert.deepEqual(v, [21]);
                    done();
                  })
                })
              });
            });
          });
        });
      });
    })
    it("should fallback if miss", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-1" } };
      var settings2 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-2" } };
      var test = new MultiStore({ cacheOnMiss: false, stores: [settings1, settings2] });
      var db1 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-1" });
      var db2 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-2" });
      test.connect(function () {
        db1.connect(function () {
          db2.connect(function () {
            test.del("y", function() {
              db2.set("y", 24, function() {
                db1.get("y", function(v) {
                  assert.deepEqual(v, []);
                  test.get("y", function(v) {
                    assert.deepEqual(v, [24]);
                    db1.get("y", function(v) {
                      assert.deepEqual(v, []);
                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    })
    it("should cache on miss", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-1" } };
      var settings2 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-2" } };
      var test = new MultiStore({ cacheOnMiss: true, stores: [settings1, settings2] });
      var db1 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-1" });
      var db2 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-2" });
      test.connect(function () {
        db1.connect(function () {
          db2.connect(function () {
            test.del("y", function() {
              db2.set("y", 24, function() {
                db1.get("y", function(v) {
                  assert.deepEqual(v, []);
                  test.get("y", function(v) {
                    assert.deepEqual(v, [24]);
                    db1.get("y", function(v) {
                      assert.deepEqual(v, [24]);
                      test.get("y", function(v) {
                        assert.deepEqual(v, [24]);
                        done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    })
    it("should insert all cache on miss", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-1" } };
      var settings2 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-2" } };
      var test = new MultiStore({ cacheOnMiss: true, stores: [settings1, settings2] });
      var db1 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-1" });
      var db2 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-2" });
      test.connect(function () {
        db1.connect(function () {
          db2.connect(function () {
            test.del({ type: "z" }, function() {
              db2.set({ type: "z", age: 24 }, { name: "Leander" }, function() {
                db2.set({ type: "z", age: 21 }, { name: "Samantha" }, function() {
                  db1.get({ type: "z" }, function(v) {
                    assert.deepEqual(v, []);
                    test.get({ type: "z" }, function(v) {
                      assert.deepEqual(v, [{ name: "Leander" }, { name: "Samantha" }]);
                      db1.get({ type: "z" }, function(v) {
                        assert.deepEqual(v, [{ name: "Leander" }, { name: "Samantha" }]);
                        done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    })
  });
  describe('#should properly deal with partial cache', function() {
    it("should miss on partial hits", function (done) {
      var settings1 = { type: "memory" };
      var settings2 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-1" } };
      var test = new MultiStore({ cacheOnMiss: true, stores: [settings1, settings2] });
      var db1 = new MongoStore({ db: "testing", collectionName: "mocha-test-1" });
      test.connect(function () {
        db1.connect(function () {
          test.del({ type: "z" }, function() {
            db1.del({ type: "z" }, function() {
              db1.set({ type: "z", age: 24 }, { name: "Leander" }, function() {
                db1.set({ type: "z", age: 21 }, { name: "Samantha" }, function() {
                  console.log("Should miss here");
                  test.get({ type: "z", age: 24 }, function(v) {
                    assert.deepEqual(v, [{ name: "Leander" }]);
                    console.log("Should miss again here");
                    test.get({ type: "z" }, function(v) {
                      assert.deepEqual(v, [{ name: "Leander" }, { name: "Samantha" }]);
                      console.log("Should hit here");
                      test.get({ type: "z" }, function(v) {
                        assert.deepEqual(v, [{ name: "Leander" }, { name: "Samantha" }]);
                        done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    })
  });
  describe('#call cb once only', function() {
    it("should fetch from the first", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-1" } };
      var settings2 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-2" } };
      var test = new MultiStore({ stores: [settings1, settings2] });
      var c = 0;
      test.connect(function () {
        if (c) throw new Exception("Called twice.");
        c = 1;
        done();
      });
    })
  });
});