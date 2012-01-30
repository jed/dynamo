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

  watch: function(cb) {
    var status, self = this

    self.fetch(function(err, table) {
      if (err) return cb(err)

      status = table.status

      self.fetch(function watch(err, table) {
        if (err) cb(err)

        else if (status != table.status) cb(null, table)

        else setTimeout(self.fetch.bind(self, watch), 5000)
      })
    })

    return this
  }
}

function Key(name, type) {
  switch (typeof name) {
    case "object": this.name = name.name, type = name.type; break
    default: this.name = name || "id"
  }

  switch (typeof type) {
    case "function": this.type = type.name; break
    case "string":   this.type = type; break
    default:         this.type = "String"
  }
}

Key.prototype = {
  toJSON: function() {
    return {
      AttributeName: this.name,
      AttributeType: this.type.charAt(0)
    }
  },

  parse: function(data) {
    this.name = data.AttributeName
    this.type = {"S": "String", "N": "Number"}[data.AttributeType]

    return this
  }
}

function Schema(hash, range) {
  if (Array.isArray(hash)) range = hash[1], hash = hash[0]

  this.hash = new Key(hash)

  if (range) this.range = new Key(range)
}

Schema.prototype = {
  toJSON: function() {
    return {
      HashKeyElement: this.hash,
      RangeKeyElement: this.range
    }
  },

  parse: function(data) {
    this.hash = (new Key).parse(data.HashKeyElement)

    if (data.RangeKeyElement) {
      this.range = (new Key).parse(data.RangeKeyElement)
    }

    return this
  }
}

function Throughput(read, write) {
  if (Array.isArray(read)) write = read[1], read = read[0]

  this.read = read || this.read
  this.write = write || this.write
}

Throughput.prototype = {
  read: 5,
  write: 5,

  toJSON: function() {
    return {
      ReadCapacityUnits: this.read,
      WriteCapacityUnits: this.write
    }
  },

  parse: function(data) {
    this.read = data.ReadCapacityUnits
    this.write = data.WriteCapacityUnits

    return this
  }
}

Schema.Key = Key
Table.Schema = Schema
Table.Throughput = Throughput

module.exports = Table