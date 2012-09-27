var types = {S: String, N: Number}
  , keys = ["HashKeyElement", "RangeKeyElement"]

function KeySchema(attrs) {
  function setSchemaKey(pos, keyName, keyType) {
    if (pos > 1) throw new Error("More than two keys specified.")
    this[keys[pos]] = new SchemaKey(keyName, keyType)
  }

  if (attrs) {
    if (Array.isArray(attrs)) {
      attrs.forEach(function(element, pos) {
        setSchemaKey.call(this, pos, element[0], element[1])
      }, this)
    } else {
      Object.keys(attrs).forEach(function(name, pos) {
        setSchemaKey.call(this, pos, name, attrs[name])
      }, this)
    }
  }
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
