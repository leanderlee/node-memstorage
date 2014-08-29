var MemoryStore = require("../lib/memory");
var assert = require("assert");

describe('MemoryStorage', function(){
  describe('#string', function() {
    it("should set x", function (done) {
      var test = new MemoryStore();
      test.connect(function () {
        test.set("x", 21, function() {
          test.get("x", function (v) {
            assert.deepEqual(v, [21]);
            done();
          })
        })
      })
    })
  });
  describe('#empty', function() {
    it("should be nothing", function (done) {
      var test = new MemoryStore();
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
      var test = new MemoryStore();
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "anna@apple.com" }, function() {
          test.set({ first: "Samantha", last: "Apple" }, { email: "arthur@apple.com" }, function() {
            test.get({ last: "Apple" }, function (v) {
              assert.deepEqual(v, [{ email: "anna@apple.com" }, { email: "arthur@apple.com" }]);
              done();
            })
          })
        })
      })
    })
    it("should include key", function (done) {
      var test = new MemoryStore({ includeKey: true });
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "anna@apple.com" }, function() {
          test.set({ first: "Samantha", last: "Apple" }, { email: "arthur@apple.com" }, function() {
            test.get({ last: "Apple" }, function (v) {
              assert.deepEqual(v, [
                { key: { first: "Anna", last: "Apple" }, val: { email: "anna@apple.com" } },
                { key: { first: "Samantha", last: "Apple" }, val: { email: "arthur@apple.com" } }
              ]);
              done();
            })
          })
        })
      })
    })
  });
  describe('#number', function() {
    it("should set x", function (done) {
      var test = new MemoryStore();
      test.connect(function () {
        test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
          test.set({ first: "Samantha", age: 20 }, { email: "arthur@apple.com" }, function() {
            test.get({ age: 20 }, function (v) {
              assert.deepEqual(v, [{ email: "anna@apple.com" }, { email: "arthur@apple.com" }]);
              done();
            })
          })
        })
      })
    })
  });
  describe('#no permute', function() {
    it("should not find partial match", function (done) {
      var test = new MemoryStore({ permute: false });
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "anna@apple.com" }, function() {
          test.set({ first: "Samantha", last: "Apple" }, { email: "arthur@apple.com" }, function() {
            test.get({ last: "Apple" }, function (v) {
              assert.deepEqual(v, []);
              done();
            })
          })
        })
      })
    })
    it("should not find partial even if include key is true", function (done) {
      var test = new MemoryStore({ includeKey: true, permute: false });
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "anna@apple.com" }, function() {
          test.set({ first: "Samantha", last: "Apple" }, { email: "arthur@apple.com" }, function() {
            test.get({ last: "Apple" }, function (v) {
              assert.deepEqual(v, []);
              done();
            })
          })
        })
      })
    })
    it("should find an exact match", function (done) {
      var test = new MemoryStore({ permute: false });
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "anna@apple.com" }, function() {
          test.set({ first: "Samantha", last: "Apple" }, { email: "arthur@apple.com" }, function() {
            test.get({ first: "Samantha", last: "Apple" }, function (v) {
              assert.deepEqual(v, { email: "arthur@apple.com" });
              done();
            })
          })
        })
      })
    })
    it("should find an exact match with include key", function (done) {
      var test = new MemoryStore({ includeKey: true, permute: false });
      test.connect(function () {
        test.set({ first: "Anna", last: "Apple" }, { email: "anna@apple.com" }, function() {
          test.set({ first: "Samantha", last: "Apple" }, { email: "arthur@apple.com" }, function() {
            test.get({ first: "Samantha", last: "Apple" }, function (v) {
              assert.deepEqual(v, { key: { first: "Samantha", last: "Apple" }, val: { email: "arthur@apple.com" } });
              done();
            })
          })
        })
      })
    })
  });
  describe('#number', function() {
    it("should ", function (done) {
      var test = new MemoryStore();
      test.connect(function () {
        test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
          test.set({ first: "Samantha", age: 20 }, { email: "arthur@apple.com" }, function() {
            test.get({ age: 20 }, function (v) {
              assert.deepEqual(v, [{ email: "anna@apple.com" }, { email: "arthur@apple.com" }]);
              done();
            })
          })
        })
      })
    })
  });
  describe('#noexist', function() {
    var test = new MemoryStore();
    it("should be null on cache miss", function (done) {
      var nullTest = new MemoryStore({ nullOnMiss: true });
      nullTest.connect(function () {
        nullTest.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
          nullTest.get({ first: "Tom" }, function (v) {
            assert.equal(v, null);
            done();
          })
        })
      })
    });
    it("should be empty when not found", function (done) {
      test.connect(function () {
        test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
          test.get({ first: "Tom" }, function (v) {
            assert.deepEqual(v, []);
            done();
          })
        })
      })
    });
    it("should be empty when no query", function (done) {
      test.get({}, function (v) {
        assert.deepEqual(v, []);
        done();
      })
    });
  });
  describe('#noexist 2', function() {
    var test = new MemoryStore();
    it("should be empty when not found", function (done) {
      test.connect(function () {
        test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
          test.get({ first: "Anna", age: 21 }, function (v) {
            assert.deepEqual(v, []);
            done();
          })
        })
      })
    });
  });
  describe('#del', function() {
    var test = new MemoryStore();
    it("should delete all indices", function (done) {
      test.connect(function () {
        test.set({ first: "Anna", age: 20 }, { email: "anna@domain.com" }, function() {
          test.set({ first: "Ben", age: 20 }, { email: "ben@domain.com" }, function() {
            test.set({ first: "Carl", age: 21 }, { email: "ben@domain.com" }, function() {
              test.get({ age: 20 }, function (v) {
                assert.deepEqual(v, [{ email: "anna@domain.com" }, { email: "ben@domain.com" }]);
                test.del({ first: "Anna" }, function () {
                  test.get({ age: 20 }, function (v) {
                    assert.deepEqual(v, [{ email: "ben@domain.com" }]);
                    done();
                  })
                })
              })
            })
          })
        })
      })
    });
  });
  describe('#del advanced 1', function() {
    var test = new MemoryStore();
    it("should delete two", function (done) {
      test.connect(function () {
        test.set({ kind: "person", first: "Anna", age: 20 }, { email: "anna@domain.com" }, function() {
          test.set({ kind: "person", first: "Ben", age: 20 }, { email: "ben@domain.com" }, function() {
            test.set({ kind: "person", first: "Carl", age: 21 }, { email: "carl@domain.com" }, function() {
              test.set({ kind: "person", first: "Dan" }, { email: "dan@domain.com" }, function() {
                test.del({ age: 20 }, function () {
                  test.get({ kind: "person" }, function (v) {
                    assert.deepEqual(v, [{ email: "carl@domain.com" }, { email: "dan@domain.com" }]);
                    done();
                  })
                })
              })
            })
          })
        })
      })
    });
  });
  describe('#del advanced 2', function() {
    var test = new MemoryStore();
    it("should delete properly", function (done) {
      test.connect(function () {
        test.set({ venue: "venue1", origin: "test", destination: "test" }, { foo: "bar" }, function() {
          test.get({ venue: "venue1", origin: "test", destination: "test" }, function(v) {
            assert.deepEqual(v.length > 0, true);
            test.del({ venue: "venue1", origin: "faux", destination: "test" }, function () {
              test.get({ venue: "venue1", origin: "test", destination: "test" }, function(v) {
                assert.deepEqual(v.length > 0, true);
                done();
              });
            })
          })
        })
      })
    });
  });
  describe('#multiset', function() {
    var test = new MemoryStore();
    it("should only set once", function (done) {
      test.connect(function () {
        test.set({ venue: "venue1", origin: "test", destination: "test" }, { foo: "bar1" }, function() {
          test.set({ venue: "venue1", origin: "test", destination: "test" }, { foo: "bar2" }, function() {
            test.get({ venue: "venue1", origin: "test", destination: "test" }, function(v) {
              assert.deepEqual(v.length == 1, true);
              done();
            })
          })
        })
      })
    });
  });
  describe('#multiset', function() {
    var test = new MemoryStore();
    it("should only set once", function (done) {
      test.connect(function () {
        test.set({ foo: "bar1" }, { foo: "bar1" }, function() {
          test.get({ foo: "bar1" }, function(v) {
            assert.deepEqual(v, [{ foo: "bar1" }]);
            test.set({ foo: "bar1" }, { foo: "bar2" }, function() {
              test.get({ foo: "bar1" }, function(v) {
                assert.deepEqual(v, [{ foo: "bar2" }]);
                done();
              })
            })
          })
        })
      })
    });
  });
  describe('#del nonexist', function() {
    var test = new MemoryStore();
    it("should delete none", function (done) {
      test.connect(function () {
        test.set({ kind: "person", first: "Anna", age: 20 }, { email: "anna@domain.com" }, function() {
          test.set({ kind: "person", first: "Ben", age: 20 }, { email: "ben@domain.com" }, function() {
            test.del({ foo: 20 }, function () {
              test.get({ kind: "person" }, function (v) {
                assert.deepEqual(v, [{ email: "anna@domain.com" }, { email: "ben@domain.com" }]);
                done();
              })
            })
          })
        })
      })
    });
  });
  /*
  describe('#set performance', function() {
    var test = new MemoryStore();
    it("should work fast on 40000", function (done) {
      test.connect(function () {
        var count = 40000;
        var start = (new Date()).getTime();
        var next = function () {
          test.set({ venue: "venue1", origin: "test", destination: "test" }, { foo: "bar1" }, function() {
            count--;
            if (count <= 0) {
              var diff = (new Date()).getTime() - start;
              assert.ok(diff < 300, "Setting 40000 took " + diff + "ms. Not reasonable!");
              done();
            } else {
              process.nextTick(function () {
                next();
              })
            }
          });
        };
        next();
      })
    });
  });
  //*/
});
