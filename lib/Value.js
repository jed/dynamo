var Attributes = null;

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
    var len, i, _vs, _v;
    var name = Object.keys(data)[0]
      , value = data[name]

    switch (name) {
      case "S":
      case "SS":
	return value

      case "N":
	return Number(value)

      case "BOOL":
      case "NULL":
   return Boolean(value)
   
      case "L":
   _vs = [];
   for (i = 0, len = value.length; i < len; i++) {
      _vs.push( Value.prototype.parse(value[i]) );
   }
   return _vs
       
   return Boolean(value)
 
      case "B":
   return new Buffer(value)

      case "NS":
	return value.map(Number)
    
      case "M":
   // prevent circular require
   if( !Attributes ){
      Attributes = require("./Attributes");
   }
   return Attributes.prototype.parse(value);
        
      default:
	throw new Error("Invalid data type: " + name)
    }
  }
}

module.exports = Value
