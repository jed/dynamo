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

Testing
-------

Continuous integration testing is handled by the excellent [Travis CI][travis]. Whenever a new commit lands in this repo, GitHub tells a custom [Heroku][heroku] app to serve my AWS credentials to Travis once when asked. This way, every commit is tested against a live DynamoDB instance without me having to publish my credentials on GitHub (if there's a better way to do this, I'd love to hear it).

If you'd like to test against your own credentials, put them in a file called `./credentials.json`, in dynamo's root directory:

```json
{
  "accessKeyId": "MY_ACCESS_KEY_ID",
  "secretAccessKey": "MY_SECRET_ACCESS_KEY"
}
```

and then run

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