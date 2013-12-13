var MemoryStore = require("../index");
var assert = require("assert");

describe('Types Check', function(){
  describe('#default', function() {
    it("should be defined", function () {
      var test = new MemoryStore();
      assert.strictEqual(!!test, true);
    })
  });
  describe('#memory', function() {
    it("should be defined", function () {
      var test = new MemoryStore({ type: "memory" });
      assert.strictEqual(!!test, true);
    })
  });
  describe('#mongo', function() {
    it("should be defined", function () {
      var test = new MemoryStore({ type: "mongo" });
      assert.strictEqual(!!test, true);
    })
  });
});