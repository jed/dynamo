var should = require("should")
  , dynamo = require("../")
  , client = dynamo.createClient()
  , db = client.get("us-east-1")

describe("teardown -", function() {
  it("delete existing test tables", function(done) {
    db.remove("DYNAMO_TEST_TABLE_1", function() {
      db.remove("DYNAMO_TEST_TABLE_2", function() {
        db.remove("DYNAMO_TEST_TABLE_3", function() {
          done()
        })
      })
    })
  })

  it("make sure no test tables exist", function(done) {
    db.get("DYNAMO_TEST_TABLE_1").watch(function() {
      db.get("DYNAMO_TEST_TABLE_2").watch(function() {
        db.get("DYNAMO_TEST_TABLE_3").watch(function() {
          done()
        })
      })
    })
  })
})
