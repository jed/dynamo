var should = require("should")
  , dynamo = require("../")
  , db = dynamo.createClient({
      accessKeyId: process.env.npm_package_config_accessKeyId,
      secretAccessKey: process.env.npm_package_config_secretAccessKey
    })

describe("teardown", function() {
  it("delete any existing tables", function(done) {
    var table1 = {TableName: "DYNAMO_TEST_TABLE_1"}
      , table2 = {TableName: "DYNAMO_TEST_TABLE_2"}

    db.deleteTable(table1, function() {
      db.deleteTable(table2, function() {
        done()
      })
    })
  })

  it("make sure no tables exist", function check1(done) {
    var table1 = {TableName: "DYNAMO_TEST_TABLE_1"}
      , table2 = {TableName: "DYNAMO_TEST_TABLE_2"}

    db.describeTable(table1, function(err, data) {
      if (!err) setTimeout(check1, 5000, done)

      else !function check2() {
        db.describeTable(table2, function(err, data) {
          if (!err) setTimeout(check2, 5000, done)

          else done()
        })
      }()
    })
  })
})