var Value = require("./Value")
  , isArray = Array.isArray

function Predicates(name, operator, value) {
  switch (typeof name) {
    case "object":
      Object.keys(name).forEach(function(key) {
        Predicates.call(this, key, name[key])
      }, this)

      return
  }

  if (Object.prototype.hasOwnProperty.call(this, name)) {
    throw new Error("Property '" + name + "'' can only be defined once.")
  }

  switch (typeof operator) {
    case "object":
      Object.keys(operator).forEach(function(key) {
        Predicates.call(this, name, key, operator[key])
      }, this)

      return

    case "undefined":
      operator = "!="
      value = null
      break
  }

  switch (typeof value) {
    case "undefined":
      value = operator
      operator = "=="
      break
  }

  if (!isArray(value)) value = [value]

  switch (operator) {
    case "!=":
      if (value[0] === null) operator = "NOT_NULL", value = []
      else operator = "NE"
      break

    case "==":
      if (value[0] === null) operator = "NULL", value = []
      else operator = "EQ"
      break

    case ">":
      operator = "GT"
      break

    case "<":
      operator = "LT"
      break

    case ">=":
      operator = value.length > 1 ? "BETWEEN" : "GE"
      break

    case "<=":
      operator = value.length > 1 ? "BETWEEN" : "LE"
      break

    case "contains":
      operator = "CONTAINS"
      break

    case "!contains":
      operator = "NOT_CONTAINS"
      break

    case "startsWith":
      operator = "BEGINS_WITH"
      break

    case "in":
      operator = "IN"
      break
  }

  this[name] = {
    ComparisonOperator: operator,
    AttributeValueList: value.map(Value)
  }
}

module.exports = Predicates
