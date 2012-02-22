var crypto = require("crypto")
  , Database = require("./Database")
  , Session = require("./Session")

function Account(credentials) {  
  this.session = new Session(credentials)
  this.database = new Database(this)
}

Account.prototype.sign = function sign(request, cb) {
  this.session.fetch(function(err, session) {
    if (err) return cb(err)

    var hash = crypto.createHash("sha256")

    request.headers["x-amz-security-token"] = session.token

    hash = hash.update(request.toString()).digest()

    request.headers["x-amzn-authorization"] = "AWS3 " + [
      "AWSAccessKeyId=" + session.tokenCredentials.accessKeyId,
      "Algorithm=HmacSHA256",
      "SignedHeaders=host;x-amz-date;x-amz-security-token;x-amz-target",
      "Signature=" + session.tokenCredentials.sign(hash)
    ]

    cb(null, request)
  })    
}

module.exports = Account
