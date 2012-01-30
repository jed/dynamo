var has = Object.prototype.hasOwnProperty

exports.log = function(err, data) {
  err ? console.warn(err) : console.log(data)
}

exports.extend = function(attrs) {
  for (var name in attrs) {
    if (has.call(attrs, name)) {
      this[name] = attrs[name]
    }      
  }
}