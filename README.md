Memory Storage for NodeJS
===============

This is a really simple library meant to abstract away how the data is physically stored from (JS) code.

It's great for clusters, scalable web processes, and any application code that may get restarted frequently but still need to connect to some sort of persistent storage.

## Getting Started

To start using this module, simply do `npm install memstorage`.

```js
var Store = require("memstorage");
var store = Store(opts);
```

`opts` determine what kind of underlying storage engine to use.

### Using RAM as storage (Default)
```js
opts = {
	type: "memory"
}
```

### Using Mongo as storage
```js
opts = {
	type: "mongo",
	settings: {
		host: "localhost",
		port: 27017,
		user: "someuser",
		pass: "somepass",
		db: "somedb",
		collectionName: "somecollection"
	}
}
```


## Inserting into the Store

```js
store.connect(function () {
	store.set({ name: "Leander", age: 20 }, data, function () {
		
	})
})

```

## Fetching from the Store

```js
store.connect(function () {
	store.get({ name: "Leander" }, function (v) {
		// v == data
	})
})
```

## Deleting from the Store

```js
store.connect(function () {
	store.del({ name: "Leander" }, function () {

	})
})
```


That's it!

Additional connection types, such as Redis, etc. can be abstracted from this later using the following 4 functions:

- `connect(cb(success))` - Connects to the underlying memory storage engine and calls `cb` with whether it worked or failed.
- `set(key, val, cb)` - Sets the key to the given value and calls `cb` when done.
- `get(key, cb(result))` - Grabs the key and returns an array of values that matches the key as the first parameter of `cb`.
- `del(key, cb)` - Deletes anything that matches key and calls `cb` when done.

