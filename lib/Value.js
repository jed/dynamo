function Value(value) {
  switch (typeof value) {
    case "number": return {N: String(value)}
    case "string": return {S: value}
  }

  if (value) switch (typeof value[0]) {
    case "number": return {NN: value.map(String)}
    case "string": return {SS: value}
  }

  throw new Error("Invalid key value type.")
}

Value.prototype = {
  parse: function(data) {
    var name = Object.keys(data)[0]
      , value = data[name]

    switch (name) {
      case "S":
      case "SS":
        return value

      case "N":
        return Number(value)

      case "NS":
        return value.map(Number)

      default:
        throw new Error("Invalid data type: " + name)
    }
  }
}

module.exports = Value
