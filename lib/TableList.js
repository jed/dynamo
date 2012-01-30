var Table = require("./Table")
  , utils = require("./utils")
  , extend = utils.extend
  , log = utils.log
  , shift = Array.prototype.shift

function TableList(attrs){ extend.call(this, attrs) }

TableList.prototype = {
  add: function() {
    var name = shift.call(arguments)
      , table = this.get(name)

    table.create.apply(table, arguments)

    return this
  },

  remove: function() {
    var name = shift.call(arguments)
      , table = this.get(name)

    table.destroy.apply(table, arguments)

    return this
  },

  get: function(arg) {
    var obj

    switch (typeof arg) {
      case "string":
        obj = new Table({database: this.database, name: arg})

        return obj.get.apply(obj, arguments)

      case "number":
        obj = new TableList(this)
        obj.limit = arg

        return obj

      default: throw new Error("Not supported.")
    }
  },

  fetch: function fetch() {
    var cb = shift.call(arguments) || log
      , self = this
      , data

    if (typeof cb != "function") {
      self = this.get(cb)
      self.fetch.apply(self, arguments)

      return this
    }

    data = {
      ExclusiveStartTableName: this.from,
      Limit: this.limit
    }

    this.database.request("ListTables", data, function(err, data, next) {
      if (err) return cb(err, null, next)

      var last = data.LastEvaluatedTableName
        , names = data.TableNames
        , tables
      
      tables = names.map(function(name) {
        return new Table({database: self.database, name: name})
      })

      if (!last) return cb(null, tables)
      
      self = new TableList({
        database: self.database,
        limit: self.limit,
        from: last
      })

      cb(null, tables, fetch.bind(self, cb))
    })

    return self    
  },

  forEach: function(cb) {
    cb || (cb = log)

    this.fetch(function(err, tables, next) {
      if (err) cb(err, null, next)

      else !function iter() {
        cb(null, tables.shift(), tables.length ? iter : next)
      }()
    })
  }
}

module.exports = TableList