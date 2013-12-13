Memory Storage for NodeJS
===============

Really simple to use. Here is an example of how this store would work:

```js

var storage = require("memstorage");


var key = { name: "Leander", age: 20 };
var val = { picture: "http://example.com/picture.png", email: "leander@example.com" };

var people = storage();
people.connect(function () {
	people.set(key, val, function () {
		people.get({ name: "Leander" }, function (v) {
			// v == val
		})
	})
});

```

That's it!

Additional connection types, such as MongoDB, Redis, etc. can be abstracted from this later
using the following 4 functions:

- `connect(cb(success))` - Connects to the underlying memory storage engine and calls `cb` with whether it worked or failed.
- `set(key, val, cb)` - Sets the key to the given value and calls `cb` when done.
- `get(key, cb(result))` - Grabs the key and returns an array of values that matches the key as the first parameter of `cb`.
- `del(key, cb)` - Deletes anything that matches key and calls `cb` when done.

