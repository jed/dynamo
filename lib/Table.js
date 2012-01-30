var utils = require("./utils")

  , extend = utils.extend
  , log = utils.log

function Table(attrs) {
  extend.call(this, attrs)
}

Table.prototype = {
  get: function() {
    return this
  },

  parse: function(data) {
    data = data.Table || data.TableDescription

    this.name = data.TableName

    var createdAt = data.CreationDateTime
      , size = data.TableSizeBytes
      , status = data.TableStatus
      , items = {length: data.ItemCount}
      , schema = data.KeySchema
      , throughput = data.ProvisionedThroughput

    if (createdAt)  this.createdAt = new Date(createdAt * 1000)
    if (size > -1)  this.size = size
    if (status)     this.status = status
    if (items > -1) this.items = {length: items}

    if (schema) this.schema = (new Schema).parse(schema)
    if (throughput) this.throughput = (new Throughput).parse(throughput)

    return this
  },

  request: function(target, data, cb) {
    data.TableName = this.name
    cb || (cb = log)

    this.database.request(target, data, function(err, data, next) {
      if (!err) data = (new Table).parse(data)

      cb(err, data, next)
    })

    return this
  },

  create: function(schema, throughput, cb) {
    var data

    if (schema && typeof schema == "function") {
      cb = schema
      schema = void 0
    }

    if (throughput && typeof throughput == "function") {
      cb = throughput
      throughput = void 0
    }

    data = {
      KeySchema: new Schema(schema),
      ProvisionedThroughput: new Throughput(throughput)
    }

    return this.request("CreateTable", data, cb)
  },

  destroy: function(cb) {
    return this.request("DeleteTable", {}, cb)
  },

  fetch: function(cb) {
    return this.request("DescribeTable", {}, cb)
  },

  update: function(opts, cb) {
    return this.request("UpdateTable", {}, cb)
  },
  }
}

module.exports = Table