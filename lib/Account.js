var crypto = require("crypto")
  , Database = require("./Database")
  , Session = require("./Session")

  , regions = {
      "us-east-1": true,
      "us-west-1": true,
      "us-west-2": true,
      "ap-northeast-1": true,
      "ap-southeast-1": true,
      "eu-west-1": true
    }

function Account(credentials) {
  this.session = new Session(credentials)
}

Account.prototype.getForHost = function(host, port) {
  var database = new Database(this);
  database.host = host
  database.port = port;
  return database
};

Account.prototype.get = function(host) {
  var badHost = !(host in regions)

  if (badHost) {
    console.error(
      "WARN: Assuming 'us-east-1' for backward compatibility.\n" +
      "Please use client.get(region).get(table) instead, as this will soon be deprecated."
    )

    return this.getForHost("us-east-1").get(host)
  }
  return this.getForHost("dynamodb." + host + ".amazonaws.com");
}

Account.prototype.sign = function sign(request, cb) {
  this.session.fetch(function(err, session) {
    if (err) return cb(err)

    var hash = crypto.createHash("sha256")
      , payload

    request.headers["x-amz-security-token"] = session.token

    payload = new Buffer(request.toString(), "utf8")
    hash = hash.update(payload).digest()

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
