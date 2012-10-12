var Key = require("./Key")
  , Attributes = require("./Attributes")
  , Update = require("./Update")
  , Predicates = require("./Predicates")

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

  returning: function(constant) {
    this.ReturnValues = constant

    return this
  },

  when: function(name, operator, value) {
    var predicates = new Predicates(name, operator, value)
      , expectation = this.Expected = {}
      , names = Object.keys(predicates)

    if (names.length > 1) {
      throw new Error("Only one condition allowed per expectation.")
    }

    name = names[0]
    operator = predicates[name].ComparisonOperator
    value = predicates[name].AttributeValueList[0]

    switch (operator) {
      case "NULL":
        expectation[name] = {Exists: false}
        return this

      case "NOT_NULL":
        expectation[name] = {Exists: true}
        return this

      case "EQ":
        expectation[name] = {Value: value}
        return this
    }

    throw new Error("Invalid expectation: " + [name, operator, value])
  },

  destroy: function(opts, cb) {
    if (typeof opts == "function") cb = opts, opts = {}
    this.database.request(
      "DeleteItem",
      this,
      function(err, data) {
        if (err || !data.Attributes) return cb(err)

        cb(null, Attributes.prototype.parse(data.Attributes))
      }
    )
  }
}

module.exports = Item
