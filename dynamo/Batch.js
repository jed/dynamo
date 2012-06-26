var Table = require("./Table")
  , Key = require("./Key")
  , Attributes = require("./Attributes")
  , push = Array.prototype.push
  , isArray = Array.isArray

function Batch(database) {
  Object.defineProperty(
    this, "database",
    {value: database, enumerable: false}
  )

  this.RequestItems = {}
}

Batch.prototype = {
  get: function(name, keys, attrs) {
    var items = this.RequestItems
      , tableBatch

    switch (typeof name) {
      case "function":
        name.call(this, this)
        return this

      case "object":
        for (var item in name) this.get(item, name[item])
        return this

      case "string":
        tableBatch = items[name] || (items[name] = new TableBatch)

        if (!keys) return tableBatch

        tableBatch.get(keys, attrs)
        return this
    }
  },

  fetch: function(cb) {
    var self = this
      , response = {}

    !function loop(RequestItems) {
      self.database.request(
      "BatchGetItem",
      {RequestItems: RequestItems},
      function fetch(err, data) {
        if (err) return cb(err)

        Object.keys(data.Responses).forEach(function(name) {
          var table = response[name] || (response[name] = [])

          data.Responses[name].Items.forEach(function(attrs) {
            table.push(Attributes.prototype.parse(attrs))
          })
        })

        if (data.UnprocessedKeys) loop(data.UnprocessedKeys)

        else cb(err, response)
      }
      )
    }(this.RequestItems)
  }
}

function TableBatch() {
  this.Keys = []
  this.AttributesToGet = []
}

TableBatch.prototype = {
  toJSON: function() {
    var obj = {Keys: this.Keys}

    if (this.AttributesToGet.length) obj.AttributesToGet = this.AttributesToGet

    return obj
  },

  get: function(keys, attrs){
    if (typeof keys == "function") {
      keys.call(this, this)
      return this
    }

    if (!isArray(keys)) keys = [keys]

    push.apply(this.Keys, keys.map(Key))

    if (attrs) attrs.forEach(function(name) {
      if (this.AttributesToGet.indexOf(name) < 0) {
      this.AttributesToGet.push(name)
      }
    }, this)

    return this
  }
}

module.exports = Batch
