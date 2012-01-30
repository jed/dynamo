var Account = require("./Account")

exports.Account = Account

exports.createClient = function(credentials) {
  if (!credentials) {
    credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  }

  return new Account(credentials).database
}