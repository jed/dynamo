var types = {S: String, N: Number}
  , keys = ["HashKeyElement", "RangeKeyElement"]

function KeySchema(attrs) {
  attrs && Object.keys(attrs).forEach(function(name, pos) {
    if (pos > 1) throw new Error("More than two keys specified.")

    this[keys[pos]] = new SchemaKey(name, attrs[name])
  }, this)
}

KeySchema.prototype = {
  parse: function(data) {
    this.HashKeyElement = (new SchemaKey).parse(data.HashKeyElement)

    if (data.RangeKeyElement) {
      this.RangeKeyElement = (new SchemaKey).parse(data.RangeKeyElement)
    }

    return this
  }
}

function SchemaKey(name, type) {
  this.AttributeName = name
  this.AttributeType = type
}

SchemaKey.prototype = {
  toJSON: function() {
    return {
      AttributeName: this.AttributeName,
      AttributeType: this.AttributeType.name.charAt(0)
    }
  },

  parse: function(data) {
    this.AttributeName = data.AttributeName,
    this.AttributeType = types[data.AttributeType]

    return this
  }
}

module.exports = KeySchema