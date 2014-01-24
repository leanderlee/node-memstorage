Memory Storage for Node [![Build Status](https://travis-ci.org/leanderlee/node-memstorage.png?branch=master)](http://travis-ci.org/leanderlee/memstorage)  [![NPM version](https://badge.fury.io/js/memstorage.png)](http://badge.fury.io/js/memstorage)
===============

[![NPM](https://nodei.co/npm/memstorage.png?downloads=true)](https://nodei.co/npm/memstorage/)

This is a really simple library meant to abstract away how the data is physically stored from (JS) code.

It's great for clusters, scalable web processes, and any application code that may get restarted frequently but still need to connect to some sort of persistent storage.

## Using the store

```js
var passport = { id: "abcdef" };
var passports = new Store();
passports.connect(function () {
  passports.set({ name: "Leander", age: 20 }, passport, function () {
    passports.get({ name: "Leander" }, function (v) {
      // v == passport
      passports.del({ age: 20 }, function () {
      	// All passports for people age 20 deleted.
      });
    });
  })
});
```

## Getting Started

To start using this module, simply do `npm install memstorage`.

```js
var Store = require("memstorage");
var store = Store({ type: "memory" });
```

### Types of stores:
```js
var mongo = Store({
  type: "mongo",
  settings: {
    host: "localhost",
    port: 27017,
    user: "someuser",
    pass: "somepass",
    db: "somedb",
    collectionName: "somecollection"
  }
});
var multi = Store({
  type: "multi",
  settings: {
    store: [
      { type: "memory" },
      {
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
    ]
});
```

More advanced usage can be found in the [tests](https://github.com/leanderlee/node-memstorage/tree/master/test)!


## Extending memstorage

Make your own stores by implementing these four functions:

- `connect(cb(success))` - Connects to the underlying memory storage engine and calls `cb` with whether it worked or failed.
- `set(key, val, cb)` - Sets the key to the given value and calls `cb` when done.
- `get(key, cb(result))` - Grabs the key and returns an array of values that matches the key as the first parameter of `cb`.
- `del(key, cb)` - Deletes anything that matches key and calls `cb` when done.

