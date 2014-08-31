var MongoStore = require("../lib/mongo");
var MemoryStore = require("../lib/memory");
var assert = require("assert");

describe('MongoStorage', function(){
  describe('#string', function() {
    it("should set x", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set("x", 21, function() {
          test.get("x", function (v) {
            assert.deepEqual(v, [21]);
            done();
          })
        })
      });
    })
  });
  describe('#empty', function() {
    it("should be nothing", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "anna@apple.com" }, function() {
          test.get({}, function (v) {
            assert.deepEqual(v, []);
            done();
          })
        })
      })
    })
  });
  describe('#simple', function() {
    it("should set x", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "simple@apple.com" }, function() {
          test.set({ first: "Samantha", last: "Apple" }, { email: "simple@apple.com" }, function() {
            test.get({ last: "Apple" }, function (v) {
              assert.deepEqual(v, [{ email: "simple@apple.com" }, { email: "simple@apple.com" }]);
              done();
            })
          })
        })
      });
    })
    it("should include key", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test", includeKey: true });
      test.connect(function () {
        test.del({ last: "Apple" }, function() {
          test.set({ first: "Anna", last: "Apple" }, { email: "simple@apple.com" }, function() {
            test.set({ first: "Samantha", last: "Apple" }, { email: "simple@apple.com" }, function() {
              test.get({ last: "Apple" }, function (v) {
                assert.deepEqual(v, [
                  { key: { first: "Anna", last: "Apple" }, val: { email: "simple@apple.com" } },
                  { key: { first: "Samantha", last: "Apple" }, val: { email: "simple@apple.com" } }
                ]);
                done();
              })
            })
          })
        })
      });
    })
  });
  describe('#number', function() {
    it("should set x", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.del({ age: 20 }, function() {
          test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
            test.set({ first: "Samantha", age: 20 }, { email: "arthur@apple.com" }, function() {
              test.get({ first: "Anna", age: 20 }, function (v) {
                assert.deepEqual(v, [{ email: "anna@apple.com" }]);
                test.get({ first: "Samantha", age: 20 }, function (v) {
                  assert.deepEqual(v, [{ email: "arthur@apple.com" }]);
                  done();
                })
              })
            })
          })
        })
      });
    });
  });
  describe('#nested', function() {
    it("should get both with same last name", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set({ name: { first: "Anna", last: "Apple" }, hair: "red" }, { email: "anna@apple.com" }, function() {
          test.set({ name: { first: "Benjamin", last: "Banana" }, hair: "green" }, { email: "ben@banana.com" }, function() {
            test.set({ name: { first: "Arthur", last: "Apple" }, hair: "green" }, { email: "arthur@apple.com" }, function() {
              test.get({ name: { last: "Apple" } }, function (v) {
                assert.deepEqual(v, [{ email: "anna@apple.com" }, { email: "arthur@apple.com" }]);
                done();
              })
            })
          })
        })
      });
    });
    it("should get Apple with green hair", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set({ name: { first: "Anna", last: "Apple" }, hair: "red" }, { email: "anna@apple.com" }, function() {
          test.set({ name: { first: "Benjamin", last: "Banana" }, hair: "green" }, { email: "ben@banana.com" }, function() {
            test.set({ name: { first: "Arthur", last: "Apple" }, hair: "green" }, { email: "arthur@apple.com" }, function() {
              test.get({ name: { last: "Apple" }, hair: "green" }, function (v) {
                assert.deepEqual(v, [{ email: "arthur@apple.com" }]);
                done();
              });
            })
          })
        })
      })
    });
  });
  describe('#noexist', function() {
    it("should be null when nullOnMiss", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test", nullOnMiss: true });
      test.connect(function () {
        test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
          test.get({ first: "Tom" }, function (v) {
            assert.deepEqual(v, null);
            done();
          })
        })
      })
    })
    it("should be empty when not found", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
          test.get({ first: "Tom" }, function (v) {
            assert.deepEqual(v, []);
            done();
          })
        })
      })
    })
    it("should be empty when no query", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
          test.get({}, function (v) {
            assert.deepEqual(v, []);
            done();
          })
        });
      });
    });
  });
  describe('#noexist 2', function() {
    it("should be empty when not found", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
          test.get({ first: "Anna", age: 21 }, function (v) {
            assert.deepEqual(v, []);
            done();
          });
        });
      });
    });
  });
  describe('#id overwrite', function() {
    it("should be working", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test-id" });
      test.connect(function () {
        test.del({ first: "Anna" }, function() {
          test.set({ first: "Anna", age: 20 }, { _id: "abc", email: "anna@apple.com" }, function() {
            test.get({ first: "Anna" }, function (v) {
              assert.deepEqual(v, [{ _id: "abc", email: "anna@apple.com" }]);
              done();
            });
          });
        });
      });
    });
  });
  describe('#delete', function() {
    it("should delete properly", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "anna@apple.com" }, function() {
          test.set({ first: "Samantha", last: "Apple" }, { email: "samantha@apple.com" }, function() {
            test.del({ first: "Anna" }, function() {
              test.get({ last: "Apple" }, function (v) {
                assert.deepEqual(v, [{ email: "samantha@apple.com" }]);
                done();
              })
            })
          })
        })
      });
    })
    it("should delete multiple", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "anna@apple.com" }, function() {
          test.set({ first: "Samantha", last: "Apple" }, { email: "samantha@apple.com" }, function() {
            test.del({ last: "Apple" }, function() {
              test.get({ last: "Apple" }, function (v) {
                assert.deepEqual(v, []);
                done();
              })
            })
          })
        })
      });
    });
    it("should delete none if no filter", function (done) {
      var test = new MongoStore({ db: "testing", collectionName: "mocha-test" });
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "user@apple.com" }, function() {
          test.set({ first: "Samantha", last: "Apple" }, { email: "user@apple.com" }, function() {
            test.del({}, function() {
              test.get({ last: "Apple" }, function (v) {
                assert.deepEqual(v, [{ email: "user@apple.com" }, { email: "user@apple.com" }]);
                done();
              })
            })
          })
        })
      });
    })
  });
  describe('#copy', function() {
    it("should copy", function (done) {
      var db1 = new MemoryStore();
      var db2 = new MongoStore({ db: "testing", collectionName: "mocha-copy-test" });
      db1.connect(function () {
      db2.connect(function () {
        db1.del({ age: 20 }, function() {
        db2.del({ age: 20 }, function() {
          db1.get({ age: 20 }, function (v) {
            assert.deepEqual(v, []);
            db2.get({ age: 20 }, function (v) {
              assert.deepEqual(v, []);
              db2.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
              db2.set({ first: "Samantha", age: 20 }, { email: "arthur@apple.com" }, function() {
                db1.get({ age: 20 }, function (v) {
                  assert.deepEqual(v, []);
                  db2.copy(db1, function () {
                    db1.get({ age: 20 }, function (v) {
                      assert.deepEqual(v, [{ email: "anna@apple.com" }, { email: "arthur@apple.com" }]);
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
      });
      });
    });
  });
});
