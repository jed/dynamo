var Predicates = require("./Predicates")
  , Attributes = require("./Attributes")

function Query(table, database) {
  this.TableName = table

  Object.defineProperty(
    this, "database",
    {value: database, enumerable: false}
  )
}

Query.prototype = {
  get: function() {
    this.AttributesToGet = Array.prototype.concat.apply([], arguments)

    return this
  },

  reverse: function() {
    this.ScanIndexForward = false

    return this
  },

  filter: function(predicates) {
    var predicates = new Predicates(predicates)
      , keys = Object.keys(predicates)
      , hashKey = keys[0]
      , rangeKey = keys[1]

    if (predicates[hashKey].ComparisonOperator != "EQ") {
      throw new Error("Query hash key comparison must be '=='.")
    }

    this.HashKeyValue = predicates[hashKey].AttributeValueList[0]
    if (rangeKey) {
      this.RangeKeyCondition = {
        ComparisonOperator: predicates[rangeKey].ComparisonOperator,
        AttributeValueList: predicates[rangeKey].AttributeValueList
      }
    }

    return this
  },

  limit: function( count ){
    var i = parseInt( count, 10 )
    if( !isNaN( i ) ){
      this.Limit = i
    }
    return this
  },

  startAt: function(predicates) {
    var predicates = new Predicates(predicates)
      , keys = Object.keys(predicates)
      , hashKey = keys[0]
      , rangeKey = keys[1]

      if (keys.length != 2) {
        throw new Error("Both hash and range keys are required for a `cursor` definition.")
      }

      this.ExclusiveStartKey = {
      	"HashKeyElement": predicates[hashKey].AttributeValueList[0],
      	"RangeKeyElement": predicates[rangeKey].AttributeValueList[0]
      }
      
      return this
  },

  count: function() {
    this.Count = true

    return this
  },

  fetch: function(opts, cb) {
    var self = this
      , response = []

    if (typeof opts == "function") cb = opts, opts = {}
    if (opts.consistent) this.ConsistentRead = true

    !function loop(ExclusiveStartKey) {
      self.database.request(
        "Query",
        self,
        function fetch(err, data) {
          if (err) return cb(err)

          if (self.Count) return cb(null, data.Count)

          data.Items.forEach(function(item) {
            response.push(Attributes.prototype.parse(item))
          })

         if (data.LastEvaluatedKey && self.Limit == undefined )
         	loop(data.LastEvaluatedKey)
         else 
          	cb(null, response)
        }
      )
    }(this.ExclusiveStartKey)
  }
}

module.exports = Query
