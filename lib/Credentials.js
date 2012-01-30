var crypto = require("crypto")

function Credentials(attrs) {
  var secretAccessKey = attrs.secretAccessKey

  this.accessKeyId = attrs.accessKeyId

  if (!secretAccessKey) {
    throw new Error("No secret access key provided.")
  }

  if (!this.accessKeyId) {
    throw new Error("No access key id provided.")
  }

  this.sign = function(data) {
    return crypto
      .createHmac("sha256", secretAccessKey)
      .update(data)
      .digest("base64")
  }
}

module.exports = Credentials