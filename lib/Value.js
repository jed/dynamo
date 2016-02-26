var Attributes = null;


type = require( "type-detect" )

function Value(value) {
  var len, i, _vs, _v;
  if( !Attributes ){
     Attributes = require("./Attributes");
  }

  switch (type(value)) {
    case "number": return {N: String(value)}
    case "string": return {S: value}
    case "object": return {M: Attributes( value )}
    case "boolean": return {BOOL: value.toString() }
    case "buffer": return {B: value.toString('base64') }
  }

  if (value) switch (typeof value[0]) {
    case "number": return {NN: value.map(String)}
    case "string": return {SS: value}
    default:
        _vs = [];
        for (i = 0, len = value.length; i < len; i++) {
           _vs.push( Value(value[i]) );
        }
        return { L: _vs }
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
   return new Buffer(value, "base64")

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
