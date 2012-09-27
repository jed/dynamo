var Value = require("./Value")

function Key(attrs) {
  if (!(this instanceof Key)) return new Key(attrs)

  function setSchema(value, pos) {
    if (pos > 1) throw new Error("More than two key elements specified.")

    this[["HashKeyElement", "RangeKeyElement"][pos]] = value
  }

  if (Array.isArray(attrs)) {
    attrs.forEach(function(element, pos) {
      setSchema.call(this, Value(element[1]), pos)
    }, this)
  } else {
    Object.keys(attrs).forEach(function(name, pos) {
      setSchema.call(this, Value(attrs[name]), pos)
    }, this)
  }
}

module.exports = Key
