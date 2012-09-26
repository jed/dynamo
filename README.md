dynamo
======

[![Build Status](https://secure.travis-ci.org/jed/dynamo.png)][travis]

This is a [node.js][node] binding for the [DynamoDB][dynamo] service provided by [Amazon Web Services][aws]. It aims to abstract DynamoDB's implementation (request signing, session tokens, pagination), but not its tradeoffs/philosophy, by providing two APIs:

- a [low-level-but-ugly API][low-api] that supports all 13 DynamoDB operations as-is, and
- a [high-level API][high-api] that uses the above to provide a more natural interface.

Example
-------

```javascript
var dynamo = require("dynamo")
  , client = dynamo.createClient()
  , db = client.get("us-east-1")

// High-level API

db.get("myTable")
  .query({id: "123", date: {">=": new Date - 6000 }})
  .get("id", "date", "name")
  .reverse()
  .fetch(function(err, data){ ... })

// Same call, using low-level API

db.query({
  TableName: "myTable",
  HashKeyValue: {S: "123"},
  RangeKeyValue: {
    ComparisonOperator: "LE",
    AttributeValueList: [{N: "1329912311806"}]
  },
  AttributesToGet: ["id", "date", "name"],
  ScanIndexForward: false
}, function(err, data){ ... })
```

Installation
------------

This library has no dependencies, and can be installed from [npm][npm]:

    npm install dynamo

API
---

### dynamo = require("dynamo")

This module exposes the `createClient` method, which is the preferred way to interact with dynamo.

### client = dynamo.createClient([_credentials_])

Returns a client instance attached to the account specified by the given credentials. The credentials can be specified as an object with `accessKeyId` and `secretAccessKey` members such as the following:

```javascript
client = dynamo.createClient({
  accessKeyId: "...",    // your access key id
  secretAccessKey: "..." // your secret access key
})
```

You can also omit these credentials by storing them in the environment under which the current process is running, as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

If neither of the above are provided, an error will be thrown.

### db = client.get(_regionName_)

Returns a database in the selected region. Currently, DynamoDB supports the following regions:

- `us-east-1`
- `us-west-1`
- `us-west-2`
- `ap-northeast-1`
- `ap-southeast-1`
- `eu-west-1`

Once you have a database instance, you can use either of the provided APIs:

### [High-level API][high-api] (blue pill)

The primary purpose of this library is to abstract away the often bizzare API design decisions of DynamoDB, into a composable and intuitive interface based on Database, Table, Item, Batch, Query, and Scan objects.

See [the wiki][high-api] for more information.

### [Low-level API][low-api] (red pill)

All of the [original DynamoDB operations][api] are provided as methods on database instances. You won't need to use them unless you want to sacrifice a clean interdace for more control, and don't mind learning Amazon's JSON format.

See [the wiki][low-api] for more information.

Testing
-------

Testing for dynamo is handled using continuous integration against a real DynamoDB instance, under credentials limited to Travis CI.

If you'd like to run the test stuie with your own credentials, make sure they're set using the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables, and then run the tests:

    npm test

The test suite creates three tables called `DYNAMO_TEST_TABLE_1`, `DYNAMO_TEST_TABLE_2`, and 'DYNAMO_TEST_TABLE_3` before the tests are run, and then deletes them once the tests are done. Note that you will need to delete them manually in the event that the tests fail.

To do
-----

- Factor out tests into integration tests and unit tests
- Make all callbacks optional, returning an event emitter no callback given
- Add method to specify Limit and ExclusiveStartKey

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
[low-api]: https://github.com/jed/dynamo/wiki/Low-level-API
[high-api]: https://github.com/jed/dynamo/wiki/High-level-API
[npm]: http://npmjs.org
