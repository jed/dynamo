var Predicates = require("./Predicates")
  , Attributes = require("./Attributes")

function Scan(table, database) {
  this.TableName = table

  Object.defineProperty(
    this, "database",
    {value: database, enumerable: false}
  )
}

Scan.prototype = {
  filter: function(predicates) {
    this.ScanFilter = new Predicates(predicates)

    return this
  },

  get: function() {
    this.AttributesToGet = Array.prototype.concat.apply([], arguments)

    return this
  },

  count: function() {
    this.Count = true

    return this
  },

  limit: function(limit) {
    if(isNaN(limit) || ((limit|0) != limit) || (limit|0) < 1) {
      throw new Error("Limit should be an natural number");
    }

    this.Limit = limit;
    return this;
  },

  fetch: function(cb) {
    var self = this
      , response = []

    !function loop(ExclusiveStartKey) {
      self.database.request(
        "Scan",
        self,
        function fetch(err, data) {
          if (err) return cb(err)

          if (self.Count) return cb(null, data.Count)

          data.Items.forEach(function(item) {
            response.push(Attributes.prototype.parse(item))
          })

          if (data.LastEvaluatedKey) {
            if (self.Limit != null && self.Limit < response.length) {
              loop(data.LastEvaluatedKey)
            } else {
              cb(null, response)
            }
          } else {
            cb(null, response)
          }
        }
      )
    }(this.ExclusiveStartKey)

  }
}

module.exports = Scan
