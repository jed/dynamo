var Value = require("./Value")

function Attributes(attrs) {
  var obj = {}

  Object.keys(attrs).forEach(function(key) {
    obj[key] = Value(attrs[key])
  })

  return obj
}

Attributes.prototype = {
  parse: function(data) {
    var obj = {}

    Object.keys(data).forEach(function(key) {
      obj[key] = Value.prototype.parse(data[key])
    })

    return obj
  }
}

module.exports = Attributes