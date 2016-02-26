var http   = require("http")
  , crypto = require("crypto")

function Request(host, target, data) {
  var headers = this.headers = new Headers

  this.json = JSON.stringify(data)

  headers["x-amz-target"] = Request.prototype.target + target
  headers["Host"] = this.host = host
  headers["Content-Length"] = Buffer.byteLength(this.json)
}

Request.prototype = {
  method:   "POST",
  pathname: "/",
  target:   "DynamoDB_20120810.",
  data:     {},

  toString: function() {
    return this.method +
      "\n" + this.pathname +
      "\n" +
      "\n" + this.headers +
      "\n" +
      "\n" + this.json
  },

  send: function(cb) {
    var _data = {
        method: this.method,
        host: this.host,
        port: ( this.port || 80 ),
        path: this.pathname,
        headers: this.headers
    };
    if( this.query ){
        _data.path += "?" + qs.stringify( this.query )
    }
    var request = http.request(_data, function(res) {
      var json = ""

      res.on("data", function(chunk){ json += chunk })
      res.on("end", function() {
        var error, response;
        try{
            response = JSON.parse(json);
        }catch(_error){
            cb( _error )
        }
        if (res.statusCode == 200) return cb(null, response)

        error = new Error
        error.name = response.__type
        error.message = response.message
        error.statusCode = res.statusCode

        cb(error)
      })
    })

    request.on("error", cb)

    request.write(this.json)
    request.end()
  }
}

function Headers() {
  this["x-amz-date"] = this["Date"] = (new Date).toUTCString()
  this["Content-Type"] = Headers.prototype["Content-Type"]
}

Headers.prototype = {
  "Content-Type": "application/x-amz-json-1.0",

  toString: function() {
    return "host:"                 + this["Host"] +
         "\nx-amz-date:"           + this["x-amz-date"] +
         "\nx-amz-security-token:" + this["x-amz-security-token"] +
         "\nx-amz-target:"         + this["x-amz-target"]
  }
}

Request.Headers = Headers
module.exports = Request
