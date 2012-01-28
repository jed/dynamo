var https = require("https")
  , fs = require("fs")

  , credentialHost = process.env.npm_package_config_credentialHost

module.exports = function(cb) {
  var json = ""

  console.log(process.env)

  throw new Error

  if (process.env.TRAVIS) {
    https.get({host: credentialHost}, function(res) {
      res.on("data", function(chunk){ json += chunk })
      res.on("end", parse)
    }).on("error", cb)    
  }

  else fs.readFile(__dirname + "/credentials.json", "utf8", function(err, data) {
    if (err) return cb(err)

    json = data
    parse()
  })

  function parse() {
    var data

    try { data = JSON.parse(json) }
    catch (err) { return cb(err) }

    data.accessKeyId && data.secretAccessKey
      ? cb(null, data)
      : cb(new Error("Invalid credentials."))
  }
}