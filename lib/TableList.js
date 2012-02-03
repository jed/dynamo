var Table = require("./Table")

function log(err, data) {
  err ? console.error(err) : console.log(data)
}

function TableList(){}

TableList.prototype = {
  fetch: function fetch(cb) {
    cb || (cb = log)

    var self = this
      , data = {
          ExclusiveStartTableName: this.ExclusiveStartTableName,
          Limit: this.Limit
        }

    this.database.request("ListTables", data, function(err, data, next) {
      if (err) return cb(err, null, next)

      var last = data.LastEvaluatedTableName
        , names = data.TableNames
        , tables
        , next
      
      tables = names.map(function(name) {
        return new self.database.Table(name)
      })

      if (!last) return cb(null, tables)
      
      next = new self.database.TableList
      next.Limit = self.Limit
      next.ExclusiveStartTableName = last

      cb(null, tables, fetch.bind(next, cb))
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