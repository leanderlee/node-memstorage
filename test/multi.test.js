var MultiStore = require("../lib/multi");
var MongoStore = require("../lib/mongo");
var assert = require("assert");

describe('MultiStorage', function(){
  describe('#set', function() {
    it("should insert properly", function (done) {
      var settings1 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-1" } };
      var settings2 = { type: "mongo", settings: { db: "testing", collectionName: "mocha-test-multi-2" } };
      var test = new MultiStore({ stores: [settings1, settings2] });
      var db1 = new MongoStore(settings1.settings);
      var db2 = new MongoStore(settings2.settings);
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
      var db1 = new MongoStore(settings1.settings);
      var db2 = new MongoStore(settings2.settings);
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
      var db1 = new MongoStore(settings1.settings);
      var db2 = new MongoStore(settings2.settings);
      test.connect(function () {
        db1.connect(function () {
          db2.connect(function () {
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