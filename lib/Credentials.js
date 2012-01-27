var crypto = require("crypto")

function Credentials(attrs) {
  var secretAccessKey = attrs.secretAccessKey

  this.accessKeyId = attrs.accessKeyId

  this.sign = function(data) {
    return crypto
      .createHmac("sha256", secretAccessKey)
      .update(data)
      .digest("base64")
  }
}

module.exports = Credentials