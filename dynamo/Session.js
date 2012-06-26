var https  = require("https")
  , crypto = require("crypto")
  , Credentials = require("./Credentials")

function Session(attrs) {
  this.sessionCredentials = new Credentials(attrs)
  this.tokenCredentials = null
  this.listeners = []
}

Session.prototype = {
  duration: 60 * 60 * 1000,
  refreshPadding: 60 * 1000, //refresh 1 minute ahead of time
  consumedCapacity: 0,

  fetch: function(cb) {
    if ((this.expiration - this.refreshPadding) > new Date) return cb(null, this)
    
    this.listeners.push(cb) > 1 || this.refresh()
  },

  refresh: function() {
    var req = new Request

    req.query.DurationSeconds = 0 | this.duration / 1000
    req.query.AWSAccessKeyId = this.sessionCredentials.accessKeyId
    req.query.Signature = this.sessionCredentials.sign(req.toString(), "sha256", "base64")

    req.send(function(err, data) {
      var listeners = this.listeners.splice(0)
      
      if (!err) {
        this.expiration = new Date(data.expiration)
        this.tokenCredentials = new Credentials(data)
        this.token = data.sessionToken
      }

      listeners.forEach(function(cb) {
        cb(err, err ? null : this)
      }, this)
    }.bind(this))
  }
}

function Request() {
  this.query = new Query
}

Request.prototype = {
  method:   "GET",
  host:     "sts.amazonaws.com",
  pathname: "/",

  toString: function() {
    return   this.method +
      "\n" + this.host   + 
      "\n" + this.pathname +
      "\n" + this.query.toString().slice(1)
  },

  send: function(cb) {
    var signature = encodeURIComponent(this.query.Signature)
      , query = this.query + "&Signature=" + signature
      , path = Request.prototype.pathname + query
      , options = { host: this.host, path: path }

    https.get(options, function(res) {
      var xml = ""

      res.on("data", function(chunk){ xml += chunk })
      res.on("end", function() {
        var response = new Response(xml)

        if (res.statusCode == 200) cb(null, response)

        else cb(new Error(
          response.type + "(" + response.code + ")\n\n" +
          response.message
        ))
      })
    })
  }
}

function Query() {
  this.Timestamp = (new Date).toISOString().slice(0, 19) + "Z"
}

Query.prototype = {
  Action           : "GetSessionToken",
  SignatureMethod  : "HmacSHA256",
  SignatureVersion : "2",
  Version          : "2011-06-15",

  toString: function() {
    return (
      "?AWSAccessKeyId="   + this.AWSAccessKeyId +
      "&Action="           + this.Action +
      "&DurationSeconds="  + this.DurationSeconds +
      "&SignatureMethod="  + this.SignatureMethod +
      "&SignatureVersion=" + this.SignatureVersion +
      "&Timestamp="        + encodeURIComponent(this.Timestamp) +
      "&Version="          + this.Version
    )
  }
}

function Response(xml) {
  var tag, key, regexp = /<(\w+)>(.*)</g

  while (tag = regexp.exec(xml)) {
    key = tag[1]
    key = key.charAt(0).toLowerCase() + key.slice(1)
    this[key] = tag[2]
  }
}

Request.Query = Query
Session.Request = Request
Session.Response = Response
module.exports = Session
