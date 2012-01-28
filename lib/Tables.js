var Table = require("./Table")

function Tables() {}

Tables.prototype = {
  forEach: function(opts, cb) {

  },

  fetch: function fetch(opts, cb) {
    var self = this
      , database = self.database
      , from
      , limit

    switch (typeof opts) {
      case "string":   from = opts; break
      case "number":   limit = opts; break
      case "function": cb = opts; break
      case "object":   from = opts.from, limit = opts.limit;
    }

    opts = {
      ExclusiveStartTableName: from,
      Limit: limit
    }

    self.database.request("ListTables", opts, function(err, data) {
      var table, tables, next, last

      if (err) return cb(err)
      
      tables = data.TableNames.map(function(name) {
        table = new Table

        table.name = name
        table.database = database

        return table
      })
      
      if (last = data.LastEvaluatedTableName) {
        next = fetch.bind(self, {from: last, limit: limit}, cb)
      }

      cb(null, tables, next)
    })

    return this
  },

  get: function(name) {
    var table = new Table

    table.name = name
    table.database = this.database

    return table.items
  }
}

module.exports = Tables