dynamo
======

[![Build Status](https://secure.travis-ci.org/jed/dynamo.png)][travis]

This is a [node.js][node] binding for the [DynamoDB][dynamo] service provided by [Amazon Web Services][aws]. It currently supports the entire DynamoDB API in a sugar-free (read: Amazon-flavored (read: ugly)) format. I'll be adding a more comfortable API over the coming week to map DynamoDB operations to a more node-friendly API, so stay tuned.

Goals
-----
- Use [travis-ci][travis]'s continuous integration testing for reliability
- Abstract DynamoDB's implementation, but not its tradeoffs/philosophy
- Be to DynamoDB what [@mranney][mranney]'s excellent [node_redis][node_redis] is to Redis

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