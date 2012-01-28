var Account = require("./Account")

exports.Account = Account

exports.createClient = function(credentials) {
  return new Account(credentials).database
}