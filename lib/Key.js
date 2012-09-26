var Value = require("./Value")

function Key(attrs) {
  if (!(this instanceof Key)) return new Key(attrs)

  // See: http://stackoverflow.com/questions/4775722/javascript-check-if-object-is-array
  //      http://blog.niftysnippets.org/2010/09/say-what.html
  var typeStr = Object.prototype.toString.call(attrs)

  function setSchema(value, pos) {
    if (pos > 1) throw new Error("More than two key elements specified.")

    this[["HashKeyElement", "RangeKeyElement"][pos]] = value
  }

  if (typeStr === "[object Object]") {
    Object.keys(attrs).forEach(function(name, pos) {
      setSchema.call(this, Value(attrs[name]), pos)
    }, this)
  } else if (typeStr === "[object Array]") {
    attrs.forEach(function(element, pos) {
      setSchema.call(this, Value(element[1]), pos)
    }, this)
  }
  Object.keys(attrs).forEach(function(name, pos) {
    if (pos > 1) throw new Error("More than two key elements specified.")

    this[["HashKeyElement", "RangeKeyElement"][pos]] = Value(attrs[name])
  }, this)
}

module.exports = Key
