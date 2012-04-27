var Batch = require("./Batch")
  , Table = require("./Table")
  , Request = require("./Request")

function Database(account) {
  Object.defineProperty(
    this, "account",
    {value: account, enumerable: false}
  )

  this.tables = {}
}

Database.prototype = {
  get: function(table, key) {
    if (typeof table != "string") return new Batch(this).get(table)

    table = new Table(table, this)

    return key ? table.get(key) : table
  },

  put: function(table, item) {
    return this.get(table).put(item)
  },

  add: function(table) {
    return new Table(table, this)
  },

  remove: function(table, cb) {
    return this.get(table).destroy(cb)
  },

  fetch: function(cb) {
    var self = this

    !function loop(cursor) {
      self.request(
        "ListTables",
        {ExclusiveStartTableName: cursor},
        function(err, data) {
          if (err) return cb(err)

          data.TableNames.forEach(function(name) {
            self.tables[name] = new Table(name, self)
          })

          if (cursor = data.LastEvaluatedTableName) loop(cursor)

          else cb(null, self)
        }
      )
    }()

    return this
  },

  request: function request(target, data, cb) {
    var self = this
      , req = new Request(this.host, target, data)

    this.account.sign(req, function(err, req) {
      if (err) cb(err)

      else req.send(function(err, data) {
        if (!err || err.statusCode >= 500) cb(err, data)

        else cb(err, data, request.bind(self, target, data, cb))
      })
    })

    return this
  },

  listTables: function(data, cb) {
    return this.request("ListTables", data, cb)
  },

  createTable: function(data, cb) {
    return this.request("CreateTable", data, cb)
  },

  describeTable: function(data, cb) {
    return this.request("DescribeTable", data, cb)
  },

  updateTable: function(data, cb) {
    return this.request("UpdateTable", data, cb)
  },

  deleteTable: function(data, cb) {
    return this.request("DeleteTable", data, cb)
  },

  scan: function(data, cb) {
    return this.request("Scan", data, cb)
  },

  query: function(data, cb) {
    return this.request("Query", data, cb)
  },

  batchGetItem: function(data, cb) {
    return this.request("BatchGetItem", data, cb)
  },

  batchWriteItem: function(data, cb) {
    return this.request("BatchWriteItem", data, cb)
  },

  getItem: function(data, cb) {
    return this.request("GetItem", data, cb)
  },

  putItem: function(data, cb) {
    return this.request("PutItem", data, cb)
  },

  updateItem: function(data, cb) {
    return this.request("UpdateItem", data, cb)
  },

  deleteItem: function(data, cb) {
    return this.request("DeleteItem", data, cb)
  }
}

module.exports = Database
