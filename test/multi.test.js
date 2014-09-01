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
  describe('#cache', function() {
    it("should set to cache", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-cache" } };
      var test = new MultiStore({ cache: true, stores: [settings1] });
      test.connect(function () {
        test.del({ x: 5 }, function () {
          test.set({ x: 5 }, { email: "x@unknown.com" }, function () {
            test.get({ x: 5 }, function (v) {
              assert.deepEqual(v, [{ email: "x@unknown.com" }]);
              done();
            });
          })
        })
      })
    })
    it("should del from cache", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-cache" } };
      var test = new MultiStore({ cache: true, stores: [settings1] });
      test.connect(function () {
        test.del({ x: 5 }, function () {
          test.set({ x: 5 }, { email: "x@unknown.com" }, function () {
            test.get({ x: 5 }, function (v) {
              assert.deepEqual(v, [{ email: "x@unknown.com" }]);
              test.del({ x: 5 }, function (v) {
                test.get({ x: 5 }, function (v) {
                  assert.deepEqual(v, []);
                  done();
                })
              })
            });
          })
        })
      })
    })
    it("should fetch from cache", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-cache" } };
      var test = new MultiStore({ cache: true, stores: [settings1] });
      var db1 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-cache" });
      db1.connect(function () {
        db1.set("x", 21, function() {
        db1.set("y", 24, function() {
          db1.get("y", function(v) {
            assert.deepEqual(v, [24]);
            test.connect(function () {
              test.get("x", function (v) {
                assert.deepEqual(v, [21]);
                db1.del("x", function() {
                db1.del("y", function() {
                  db1.get("x", function (v) {
                    assert.deepEqual(v, []);
                    test.get("x", function (v) {
                      assert.deepEqual(v, [21]);
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
    it("should fetch from multiple cache", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-cache-1" } };
      var settings2 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-cache-2" } };
      var test = new MultiStore({ cache: true, stores: [settings1, settings2] });
      var db1 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-cache-1" });
      var db2 = new MongoStore({ db: "testing", collectionName: "mocha-test-multi-cache-2" });
      db1.connect(function () {
      db2.connect(function () {
        db1.del({ age: 20 }, function() {
        db2.del({ age: 20 }, function() {
          db1.set({ age: 20, name: "x" }, { email: "cool@beans.com" }, function() {
          db2.set({ age: 20, name: "y" }, { email: "mean@beans.com" }, function() {
            db1.get({ name: "y" }, function(v) {
              assert.deepEqual(v, []);
            db1.get({ name: "x" }, function(v) {
              assert.deepEqual(v, [{ email: "cool@beans.com" }]);
              db2.get({ name: "y" }, function(v) {
                assert.deepEqual(v, [{ email: "mean@beans.com" }]);
              db2.get({ name: "x" }, function(v) {
                assert.deepEqual(v, []);
                test.connect(function () {
                  test.get({ name: "x" }, function (v) {
                    assert.deepEqual(v, [{ email: "cool@beans.com" }]);
                  test.get({ name: "y" }, function (v) {
                    assert.deepEqual(v, [{ email: "mean@beans.com" }]);
                  test.get({ age: 20 }, function (v) {
                    assert.ok(v.length == 2);
                    db1.del({ age: 20 }, function() {
                    db2.del({ age: 20 }, function() {
                      test.get({ name: "x" }, function (v) {
                        assert.deepEqual(v, [{ email: "cool@beans.com" }]);
                      test.get({ name: "y" }, function (v) {
                        assert.deepEqual(v, [{ email: "mean@beans.com" }]);
                      test.get({ age: 20 }, function (v) {
                        assert.ok(v.length == 2);
                        done();
                      })})}); // get test (after delete)
                    })}); // del
                  })})}); // get test (on connect)
                }); // connect
              })}); // get 2
            })}); // get 1
          })}); // set
        })}); // del
      })}); // connect
    });
  });
});