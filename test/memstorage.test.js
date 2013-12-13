var MemoryStore = require("../lib/memstorage");
var assert = require("assert");

describe('MemoryStorage', function(){
  describe('#string', function() {
    it("should set x", function (done) {
      var test = new MemoryStore();
      test.set("x", 21, function() {
        test.get("x", function (v) {
          assert.deepEqual(v, [21]);
          done();
        })
      })
    })
  });
  describe('#simple', function() {
    it("should set x", function (done) {
      var test = new MemoryStore();
      test.set({ first: "Anna", last: "Apple" }, { email: "anna@apple.com" }, function() {
        test.set({ first: "Samantha", last: "Apple" }, { email: "arthur@apple.com" }, function() {
          test.get({ last: "Apple" }, function (v) {
            assert.deepEqual(v, [{ email: "anna@apple.com" }, { email: "arthur@apple.com" }]);
            done();
          })
        })
      })
    })
  });
  describe('#number', function() {
    it("should set x", function (done) {
      var test = new MemoryStore();
      test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
        test.set({ first: "Samantha", age: 20 }, { email: "arthur@apple.com" }, function() {
          test.get({ age: 20 }, function (v) {
            assert.deepEqual(v, [{ email: "anna@apple.com" }, { email: "arthur@apple.com" }]);
            done();
          })
        })
      })
    })
  });
  describe('#nested', function() {
    var test = new MemoryStore();
    test.set({ name: { first: "Anna", last: "Apple" }, hair: "red" }, { email: "anna@apple.com" }, function() {
      test.set({ name: { first: "Benjamin", last: "Banana" }, hair: "green" }, { email: "ben@banana.com" }, function() {
        test.set({ name: { first: "Arthur", last: "Apple" }, hair: "green" }, { email: "arthur@apple.com" }, function() {
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
        })
      })
    })
  });
  describe('#noexist', function() {
      var test = new MemoryStore();
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
    });
  });
  describe('#noexist 2', function() {
      var test = new MemoryStore();
      test.set({ first: "Anna", age: 20 }, { email: "anna@apple.com" }, function() {
        it("should be empty when not found", function (done) {
          test.get({ first: "Anna", age: 21 }, function (v) {
            assert.deepEqual(v, []);
            done();
          })
        })
    });
  });
});