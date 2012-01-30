dynamo
======

[![Build Status](https://secure.travis-ci.org/jed/dynamo.png)][travis]

This is a [node.js][node] binding for the [DynamoDB][dynamo] service provided by [Amazon Web Services][aws]. It currently supports the entire DynamoDB API in an unsugared (read: Amazon-flavored (read: ugly)) format. I'll be developing a more comfortable API over the coming week to make DynamoDB operations more node-ish, so stay tuned.

Goal
----

Abstract DynamoDB's implementation (request signing, session tokens, pagination), but not its tradeoffs/philosophy.

Example
-------

```javascript
var dynamo = require("dynamo")
  , db = dynamo.createClient()
  , tables = []

db.tables.forEach(function(err, name, next) {
  if (err) return console.warn(err)

  console.log("found a table: " + table.name)

  if (next) next() // use connect-style continuations for batching
})
```
<a name="callbacks"></a>
Callbacks
---------

- All callbacks are optional, and if omitted will use `console.warn` for errors and `console.log` otherwise. This makes it easier to inspect your database in a REPL, for example.

- The signature for all callbacks is `(err, data, next)`. This is the same as the standard for most node.js programs, but with an additional `next` parameter: a continuation function such as those used in [Connect][connect] routes and other middleware. This function takes no arguments, and is passed only in the following cases:

  - The call was unsuccessful and can be retried. This is the case when DynamoDB returns a 5xx status code, indicating that the problem exists with the service, not the request. Calling `next()` will execute the same request again, so it's best used with `setTimeout`.
  - The call was successful and has subsequent results, such as for pagination or when a response hits the 1MB limit. Calling `next()` will fetch the next batch of results and call back again.

This allows you to write code like this, which logs a list of all tables:

```javascript
db = dynamo.createClient()
tables = []

db.tables.fetch(function(err, data, next) {
  if (err) {
    if (!next) throw err        // give up (for 4xx errors)
    else setTimeout(next, 5000) // try again in 5s (for 5xx errors)
  }

  else {
    tables.push.apply(tables, data)

    if (!next) console.log(tables) // log it, we've hit the end
    else next()                    // fetch the next batch and call again
  }
})
```
<a name="api"></a>
API
---

#### dynamo = require("dynamo")

This module exposes the `createClient` method, which is the preferred way to interact with dynamo. It also provides the core constructors it uses (such as `Account`, `Database`, `Session`, and `Table`), so that you can override any defaults stored as prototype properties as necessary.

### Database

#### db = dynamo.createClient([_credentials_])

Returns a database instance attached to the account specified by the given credentials. The credentials can be specified as an object with `accessKeyId` and `secretAccessKey` members such as the following:

```javascript
db = dynamo.createClient({
  accessKeyId: "...",    // your access key id
  secretAccessKey: "..." // your secret access key
})
```

You can also omit these credentials by storing them in the environment under which the current process is running, as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

If neither of the above are provided, an error will be thrown.

#### db\[_operationName_\](data, cb)

All of the original DynamoDB operations are provided as methods on database instances. You won't need to use them unless you want to sacrifice a clean interdace for more control, and don't mind learning their JSON format.

### TableList

#### tables = db.tables

Each client includes a table list object used to interact with DynamoDB tables.

#### tables.fetch([_cb_])
#### tables.fetch(_limit_, [_cb_])

Calls back with the tables in the current database, as a list of table instances. This is subject to pagination depending on the number of results, and the number of items in each batch fetched can be specified with an optional leading _limit_ integer.

#### tables.forEach([_cb_])

A convenience method that uses the `fetch` method to call back for each table fetched. This abstracts away batching, making it much easier to iterate over tables in a natural yet non-blocking way.

<!-- #### tables.add(_name_, _args..._)

An alias for `tables.get(name).create(args...)`.

#### tables.remove(_name_, _args..._)

An alias for `tables.get(name).destroy(args...)`.

### Table

#### table = tables.get(_tableName_)
 -->

### Table, Item, ItemList, etc.

Coming this week! 

<a name="lowlevelapi"></a>
Low-level API
-------------

If you'd like more control over how you interact with DynamoDB, all [12 original DynamoDB operations][api] are available as camelCased methods on database instances return by `dynamo.createClient()`. These methods are used by the higher-level APIs, and require the object format expected by Amazon.

- `batchGetItem`
- `createTable`
- `deleteItem`
- `deleteTable`
- `describeTable`
- `getItem`
- `listTables`
- `putItem`
- `query`
- `scan`
- `updateItem`
- `updateTable`

These allow you to skip dynamo's API sugar and use only its account, session, and authentication logic, for code such as the following for `createTable`:

```javascript
var dynamo = require("dynamo")
  , db = dynamo.createClient()
  , cb = console.log.bind(console)

db.createTable({
  TableName: "DYNAMO_TEST_TABLE_1",

  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },

  KeySchema: {
    HashKeyElement: {
      AttributeName: "hash",
      AttributeType: "S"
    }
  }
}, cb)
```
<a name="testing"></a>
Testing
-------

Testing for dynamo is handled using continuous integration against a real DynamoDB instance, under credentials limited to Travis CI.

If you'd like to run the test stuie with your own credentials, make sure they're set using the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables, and then run the tests:

    npm test

The test suite creates two tables called `DYNAMO_TEST_TABLE_1` and `DYNAMO_TEST_TABLE_2` before the tests are run, and then deletes them once the tests are done. Note that you will need to delete them manually in the event that the tests fail.

<a name="credits"></a>
Credits
-------

- [Travis CI][travis] for an awesome open-source testing service
- [@chriso][chriso] for letting me have the "dynamo" name on npm
- [@skomski][skomski] for turning me on to [IAM credentials][iam]
- [@mranney][mranney] for inspiration from the venerable [node_redis][node_redis]
- [@visionmedia][tj] for making testing easy with [mocha][mocha] and [should.js][should]

<a name="copyright"></a>
Copyright
---------

Copyright (c) 2012 Jed Schmidt. See LICENSE.txt for details.

Send any questions or comments [here][twitter].

[travis]: http://travis-ci.org/jed/dynamo
[node]: http://nodejs.org
[dynamo]: http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/Introduction.html
[aws]: http://aws.amazon.com
[api]: http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/operationlist.html
[mranney]: https://github.com/mranney
[skomski]: https://github.com/skomski
[node_redis]: https://github.com/mranney/node_redis
[twitter]: http://twitter.com/jedschmidt
[heroku]: http://heroku.com
[mocha]: https://visionmedia.github.com/mocha
[should]: https://github.com/visionmedia/should.js
[tj]: https://github.com/visionmedia
[iam]: http://docs.amazonwebservices.com/IAM/latest/UserGuide/IAM_Introduction.html
[connect]: http://www.senchalabs.org/connect
[chriso]: https://github.com/chriso