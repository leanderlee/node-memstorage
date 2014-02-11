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
  describe('#nested', function() {
    var test = new MemoryStore();
    test.connect(function () {
      test.set({ name: { first: "Anna", last: "Apple" }, hair: "red", awesome: true }, { email: "anna@apple.com" }, function() {
        test.set({ name: { first: "Benjamin", last: "Banana" }, hair: "green", awesome: true }, { email: "ben@banana.com" }, function() {
          test.set({ name: { first: "Arthur", last: "Apple" }, hair: "green", awesome: false }, { email: "arthur@apple.com" }, function() {
            it("should get both with same last name", function (done) {
              test.get({ name: { last: "Apple" } }, function (v) {
                assert.deepEqual(v, [{ email: "anna@apple.com" }, { email: "arthur@apple.com" }]);
                done();
              })
            })
            it("should get Apple with green hair", function (done) {
              test.get({ name: { last: "Apple" }, hair: "green" }, function (v) {
                assert.deepEqual(v, [{ email: "arthur@apple.com" }]);
                done();
              });
            })
            it("should get even in a different order", function (done) {
              test.get({ hair: "green", name: { last: "Apple" } }, function (v) {
                assert.deepEqual(v, [{ email: "arthur@apple.com" }]);
                done();
              });
            })
            it("should get boolean", function (done) {
              test.get({ awesome: true }, function (v) {
                assert.deepEqual(v, [{ email: "anna@apple.com" }, { email: "ben@banana.com" }]);
                done();
              });
            })
            it("should get ordered boolean", function (done) {
              test.get({ awesome: true, hair: "green" }, function (v) {
                assert.deepEqual(v, [{ email: "ben@banana.com" }]);
                done();
              });
            })
          })
        })
      })
    })
  });
  describe('#noexist', function() {
    var test = new MemoryStore();
    test.connect(function () {
      test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
        it("should be empty when not found", function (done) {
          test.get({ first: "Tom" }, function (v) {
            assert.deepEqual(v, []);
            done();
          })
        })
        it("should be empty when no query", function (done) {
          test.get({}, function (v) {
            assert.deepEqual(v, []);
            done();
          })
        })
      })
    });
  });
  describe('#noexist 2', function() {
    var test = new MemoryStore();
    test.connect(function () {
      test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
        it("should be empty when not found", function (done) {
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
    test.connect(function () {
      test.set({ first: "Anna", age: 20 }, { email: "anna@domain.com" }, function() {
        test.set({ first: "Ben", age: 20 }, { email: "ben@domain.com" }, function() {
          test.set({ first: "Carl", age: 21 }, { email: "ben@domain.com" }, function() {
            it("should delete all indices", function (done) {
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
    test.connect(function () {
      test.set({ kind: "person", first: "Anna", age: 20 }, { email: "anna@domain.com" }, function() {
        test.set({ kind: "person", first: "Ben", age: 20 }, { email: "ben@domain.com" }, function() {
          test.set({ kind: "person", first: "Carl", age: 21 }, { email: "carl@domain.com" }, function() {
            test.set({ kind: "person", first: "Dan" }, { email: "dan@domain.com" }, function() {
              it("should delete 2", function (done) {
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
  describe('#del nonexist', function() {
    var test = new MemoryStore();
    test.connect(function () {
      test.set({ kind: "person", first: "Anna", age: 20 }, { email: "anna@domain.com" }, function() {
        test.set({ kind: "person", first: "Ben", age: 20 }, { email: "ben@domain.com" }, function() {
          it("should delete none", function (done) {
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
});