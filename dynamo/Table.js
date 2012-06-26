var ProvisionedThroughput = require("./ProvisionedThroughput")
  , KeySchema = require("./KeySchema")
  , Scan = require("./Scan")
  , Query = require("./Query")
  , Item = require("./Item")
  , Batch = require("./Batch")
  , Update = require("./Update")
  , Attributes = require("./Attributes")

function Table(attrs, database) {
  Object.defineProperty(
    this, "database",
    {value: database, enumerable: false}
  )

  if (typeof attrs == "string") attrs = {name: attrs}

  this.TableName = attrs.name

  if (attrs.schema) this.schema(attrs.schema)
  if (attrs.throughput) this.throughput(attrs.throughput)
}

Table.prototype = {
  fetch: function(cb) {
    var self = this

    this.database.request(
      "DescribeTable",
      {TableName: this.TableName},
      function(err, data) {
        if (err) return cb(err)

        cb(null, self.parse(data))
      }
    )

    return this
  },

  save: function(cb) {
    var self = this

    if (!this.KeySchema) this.schema({id: String})
    if (!this.ProvisionedThroughput) this.throughput({read: 3, write: 5})

    this.database.request(
      "CreateTable",
      this,
      function(err, data) {
        if (err) return cb(err)

        cb(null, self.parse(data))
      }
    )

    return this
  },

  destroy: function(cb) {
    var self = this

    this.database.request(
      "DeleteTable",
      {TableName: this.TableName},
      function(err, data) {
        if (err) return cb(err)

        cb(null, self.parse(data))
      }
    )

    return this
  },

  watch: function(cb) {
    var self = this

    return this.fetch(function watch(err, table) {
      if (err) cb(err)

      else if (self.TableStatus.slice(-3) != "ING") cb(null, table)

      else setTimeout(self.fetch.bind(self, watch), 5000)
    })
  },

  schema: function(attrs) {
    this.KeySchema = new KeySchema(attrs)

    return this
  },

  throughput: function(attrs) {
    this.ProvisionedThroughput = new ProvisionedThroughput(attrs, this)

    return this
  },

  parse: function(data) {
    data = data.Table || data.TableDescription

    this.TableStatus = data.TableStatus
    this.TableName = data.TableName

    if (data.CreationDateTime) {
      this.CreationDateTime = new Date(data.CreationDateTime * 1000)
    }

    if (data.ProvisionedThroughput) {
      this.ProvisionedThroughput = new ProvisionedThroughput(this)
      this.ProvisionedThroughput.parse(data.ProvisionedThroughput)
    }

    if (data.KeySchema) {
      this.KeySchema = new KeySchema
      this.KeySchema.parse(data.KeySchema)
    }

    if (data.TableSizeBytes) {
      this.TableSizeBytes = data.TableSizeBytes
    }

    if (data.ItemCount) {
      this.ItemCount = data.ItemCount
    }

    return this
  },

  put: function(attrs) {
    var update = new Update(this.TableName, this.database)
    update.Item = Attributes(attrs)

    return update
  },

  get: function(key) {
    return new Item(key, this.TableName, this.database)
  },

  scan: function(attrs) {
    var scan = new Scan(this.TableName, this.database)

    return attrs ? scan.filter(attrs) : scan
  },

  query: function(attrs) {
    return new Query(this.TableName, this.database).filter(attrs)
  }
}

module.exports = Table
