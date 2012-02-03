var ItemList = require("./ItemList")

function log(err, data) {
  err ? console.error(err) : console.log(data)
}

function Table(attrs) {
  function TableItemList(){ ItemList.apply(this, arguments) }
  TableItemList.prototype = new ItemList
  TableItemList.prototype.table = this

  this.items = new TableItemList

  if (typeof attrs == "string") attrs = {name: attrs}

  this.set(attrs)
}

Table.prototype = {
  set: function(attrs) {
    if (attrs) {
      if (attrs.name)       this.TableName = attrs.name
      if (attrs.schema)     this.setKeySchema(attrs.schema)
      if (attrs.throughput) this.setProvisionedThroughput(attrs.throughput)
    }

    return this
  },

  setKeySchema: function(attrs) {
    var keys = Object.keys(attrs)
      , count = keys.length

    if (count > 2) throw new Error("Too many schema keys: " + count)
    if (count < 1) throw new Error("Too few schema keys: " + count)

    keys.forEach(
      function(name, pos) {
        var key  = ["HashKeyElement", "RangeKeyElement"][pos]
          , type = (attrs[name].name || attrs[name]).charAt(0)
        
        this[key] = { AttributeName: name, AttributeType: type }
      },

      this.KeySchema = {}
    )

    return this
  },

  setProvisionedThroughput: function(attrs) {
    var throughput = this.ProvisionedThroughput || {}

    throughput.ReadCapacityUnits = attrs.read
    throughput.WriteCapacityUnits = attrs.write

    this.ProvisionedThroughput = throughput
    
    return this
  },

  parse: function(attrs) {
    attrs = attrs.Table || attrs.TableDescription

    for (var key in attrs) switch (key) {
      case "CreationDateTime":
        this[key] = new Date(attrs[key] * 1000)
        break

      default:
        this[key] = attrs[key]
    }
  },

  request: function(target, data, cb) {
    var table = new this.database.Table

    data.TableName = this.TableName

    this.database.request(target, data, function(err, data, next) {
      err || table.parse(data)
      cb(err, table, next)
    })

    return this
  },

  create: function(cb) {
    var schema = this.KeySchema
      , throughput = this.ProvisionedThroughput || {}
      , data = { KeySchema: schema, ProvisionedThroughput: throughput }

    if (!schema) throw new Error("Schema required to create table.")

    throughput.WriteCapacityUnits || (throughput.WriteCapacityUnits = 5)
    throughput.ReadCapacityUnits  || (throughput.ReadCapacityUnits = 3)

    return this.request("CreateTable", data, cb || log)
  },

  destroy: function(cb) {
    return this.request("DeleteTable", {}, cb || log)
  },

  fetch: function(cb) {
    return this.request("DescribeTable", {}, cb || log)
  },

  save: function(opts, cb) {
    var throughput = this.ProvisionedThroughput
      , data = { ProvisionedThroughput: throughput }

    if (!throughput) throw new Error("Throughput required to update table.")

    return this.request("UpdateTable", data, cb || log)
  },

  watch: function(cb) {
    var self = this

    cb || (cb = log)

    this.fetch(function watch(err, table) {
      if (err) cb(err)

      else if (self.TableStatus != table.TableStatus) cb(null, table)

      else setTimeout(self.fetch.bind(self, watch), 5000)
    })

    return this
  }
}

module.exports = Table