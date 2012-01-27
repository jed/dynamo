dynamo
======

[![Build Status](https://secure.travis-ci.org/jed/dynamo.png)][travis]

This is a [node.js][node] binding for the [DynamoDB][dynamo] service provided by [Amazon Web Services][aws]. It currently supports the entire DynamoDB API in a unsugared (read: Amazon-flavored (read: ugly)) format. I'll be adding a more comfortable API over the coming week to map DynamoDB operations to a more node-friendly API, so stay tuned.

Goals
-----
- Use [travis-ci][travis]'s continuous integration testing for reliability
- Abstract DynamoDB's implementation, but not its tradeoffs/philosophy
- Be to DynamoDB what [@mranney][mranney]'s excellent [node_redis][node_redis] is to Redis

Example
-------

```javascript
var dynamo = require("dynamo") // name pending, unfortunately
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
