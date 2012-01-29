dynamo
======

[![Build Status](https://secure.travis-ci.org/jed/dynamo.png)][travis]

This is a [node.js][node] binding for the [DynamoDB][dynamo] service provided by [Amazon Web Services][aws]. It currently supports the entire DynamoDB API in an unsugared (read: Amazon-flavored (read: ugly)) format. I'll be adding a more comfortable API over the coming week to make DynamoDB operations more node-ish, so stay tuned.

Goals
-----
- Use [Travis CI][travis]'s continuous integration testing for reliability
- Abstract DynamoDB's implementation, but not its tradeoffs/philosophy
- Be to DynamoDB what [@mranney][mranney]'s excellent [node_redis][node_redis] is to Redis

Example
-------

```javascript
var dynamo = require("dynamo")
  , db = dynamo.createClient()

// the current API is unsugared, mirrors the DynamoDB API...
db.listTables({}, function(err, data) {
  if (err) return console.warn(err)

  var name, names = data.TableNames

  while (name = names.shift()) {
  	console.log("table: " + name)
  }
})

// but an additional, more node-friendly API is in the works.
// this is a theoretical example of what i have in mind:
db.tables.forEach(function(err, name, next) {
  if (err) return console.warn(err)

  console.log("table: " + name)

  if (next) next() // use connect-style continuations for batching
})
```

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

Testing
-------

Continuous integration testing is handled through [@visionmedia][tj]'s [mocha][mocha]/[should.js][should], by the excellent [Travis CI][travis]. The tests are run against a real DynamoDB instance, using [IAM credentials][iam] limited to Travis CI (thanks to @Skomski for this tip).

If you'd like these tests on your own credentials, set them as follows:

   npm config set dynamo:accessKeyId <your-access-key-id>
   npm config set dynamo:secretAccessKey <your-secret-access-key>

and then run the tests:

    npm test

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
[node_redis]: https://github.com/mranney/node_redis
[twitter]: http://twitter.com/jedschmidt
[heroku]: http://heroku.com
[mocha]: https://visionmedia.github.com/mocha
[should]: https://github.com/visionmedia/should.js
[tj]: https://github.com/visionmedia
[iam]: http://docs.amazonwebservices.com/IAM/latest/UserGuide/IAM_Introduction.html