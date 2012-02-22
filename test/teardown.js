var should = require("should")
  , dynamo = require("../")
  , db = dynamo.createClient()

describe("teardown -", function() {
  it("delete existing test tables", function(done) {
    db.remove("DYNAMO_TEST_TABLE_1", function() {
      db.remove("DYNAMO_TEST_TABLE_2", function() {
	done()
      })
    })
  })

  it("make sure no test tables exist", function(done) {
    db.get("DYNAMO_TEST_TABLE_1").watch(function() {
      db.get("DYNAMO_TEST_TABLE_2").watch(function() {
	done()
      })
    })
  })
})
