var Store = require("../index");
var assert = require("assert");

describe('Types Check', function(){
  describe('#default', function() {
    it("should be defined", function () {
      var test = Store();
      assert.strictEqual(!!test, true);
    })
  });
  describe('#notexist', function() {
    it("should be defined", function () {
      var test = Store({ type: "cheeses" });
      assert.strictEqual(test, null);
    })
  });
  describe('#memory', function() {
    it("should be defined", function () {
      var test = Store({ type: "memory" });
      assert.strictEqual(!!test, true);
    })
  });
  describe('#mongo', function() {
    it("should be defined", function () {
      var test = Store({ type: "mongo" });
      assert.strictEqual(!!test, true);
    })
  });
});