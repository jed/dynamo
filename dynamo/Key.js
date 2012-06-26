var Value = require("./Value")

function Key(attrs) {
  if (!(this instanceof Key)) return new Key(attrs)

  Object.keys(attrs).forEach(function(name, pos) {
    if (pos > 1) throw new Error("More than two key elements specified.")

    this[["HashKeyElement", "RangeKeyElement"][pos]] = Value(attrs[name])
  }, this)
}

module.exports = Key