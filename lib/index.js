var Account = exports.Account = require("./Account")

exports.Credentials = require("./Credentials")
exports.Database    = require("./Database")
exports.Request     = require("./Request")
exports.Session     = require("./Session")

exports.createClient = function(credentials) {
  if (!credentials) {
    credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  }

  return new Account(credentials)
}
