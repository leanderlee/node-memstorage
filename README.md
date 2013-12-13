Memory Storage for NodeJS
===============

Really simple to use. Here is an example of how this store would work:

```js

var MemoryStore = require("memstorage");

var people = new MemoryStore();
var key = { name: "Leander", age: 20 };
var val = { picture: "http://example.com/picture.png", email: "leander@example.com" };
people.set(key, val, function () {
	people.get({ name: "Leander "}, function (v) {
		// v == val
	})
})

```

That's it!
