var should = require("should")
  , dynamo = require("../")
  , db = dynamo.createClient()

  , table1 = new db.Table("DYNAMO_TEST_TABLE_1")
  , table2 = new db.Table("DYNAMO_TEST_TABLE_2")

describe("teardown -", function() {
  it("delete any existing tables", function(done) {
    table1.destroy(function(err, table) {
      should.not.exist(err)
      should.exist(table)

      table.should.have.property("TableStatus", "DELETING")

      table2.destroy(done)
    })
  })

  it("make sure no tables exist", function check1(done) {
    table1.fetch(function(err) {
      if (!err) setTimeout(check1, 5000, done)

      else !function check2() {
        table2.fetch(function(err) {
          err ? done() : setTimeout(check2, 5000, done)
        })
      }()
    })
  })
})