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
  target:   "DynamoDB_20111205.",
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
    var request = http.request(this, function(res) {
      var json = ""

      res.setEncoding('utf8')

      res.on("data", function(chunk){ json += chunk })
      res.on("end", function() {
        var error, response = JSON.parse(json)

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
