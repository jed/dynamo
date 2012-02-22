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

  get: function(attrs) {
    this.AttributesToGet = attrs

    return this
  },

  count: function() {
    this.Count = true

    return this
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

	  data.Items.forEach(function(item) {
	    response.push(Attributes.prototype.parse(item))
	  })

	  if (data.LastEvaluatedKey) loop(data.LastEvaluatedKey)

	  else cb(err, response)
	}
      )
    }(this.ExclusiveStartKey)

  }
}

module.exports = Scan
