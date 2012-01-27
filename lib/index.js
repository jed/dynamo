var Account = require("./Account")
  , Session = require("./Session")

exports.Account = Account
exports.Session = Session

exports.createClient = function(credentials) {
  return new Account(credentials).database
}