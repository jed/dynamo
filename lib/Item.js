var Key = require("./Key")
  , Attributes = require("./Attributes")
  , Update = require("./Update")

function Item(key, table, database) {
  Object.defineProperty(
    this, "database",
    {value: database, enumerable: false}
  )

  if (key) this.Key = Key(key)
  if (table) this.TableName = table
}

Item.prototype = {
  get: function(attrs) {
    this.AttributesToGet = attrs

    return this
  },

  update: function(key, value) {
    var update = new Update(this.TableName, this.database)
    update.Key = this.Key

    if (!key) return update

    if (typeof key == "function") {
      key.call(update, update)
      return update
    }

    return update.put(key, value)
  },

  fetch: function(opts, cb) {
    if (typeof opts == "function") cb = opts, opts = {}

    var self = this
      , attrs = {}
      , data = {
          TableName: this.TableName,
          Key: this.Key
        }
    
    if (this.AttributesToGet) data.AttributesToGet = this.AttributesToGet
    
    if (opts.consistent) data.ConsistentRead = true

    this.database.request(
      "GetItem",
      data,
      function(err, data) {
        if (err || !data.Item) return cb(err)

        cb(null, Attributes.prototype.parse(data.Item))
      }
    )

    return this
  },

  destroy: function(cb) {
    this.database.request(
      "DeleteItem",
      {TableName: this.TableName, Key: this.Key},
      function(err, data) {
        if (err || !data.Item) return cb(err)

        cb(null, Attributes.prototype.parse(data.Item))
      }
    )
  }
}

module.exports = Item
