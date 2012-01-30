var should = require("should")
  , dynamo = require("../../")
  , db = dynamo.createClient()
  , table = db.tables.get("DYNAMO_TEST_TABLE_3")

describe("Tables", function() {
  describe("#create()", function() {
    it("should create a table", function(done) {
      table.create(function(err, table) {
        should.not.exist(err)
        should.exist(table)

        table.should.have.property("name", "DYNAMO_TEST_TABLE_3")
        table.should.have.property("status", "CREATING")

        done()
      })
    })
  })

  describe("#watch()", function() {
    it("should notify when status changes", function(done) {
      table.watch(function(err, table) {
        should.not.exist(err)
        should.exist(table)

        done()
      })
    })
  })

  describe("#fetch()", function() {
    it("should return table with details", function(done) {
      table.fetch(function(err, table) {
        should.not.exist(err)
        should.exist(table)

        table.should.have.property("name", "DYNAMO_TEST_TABLE_3")
        table.should.have.property("status", "ACTIVE")

        table.should.have.property("createdAt")
        table.createdAt.should.be.an.instanceof(Date)

        table.should.have.property("size")
        table.size.should.be.a("number")

        table.should.have.property("schema")
        table.should.have.property("throughput")

        done()
      })
    })
  })

  describe("#destroy()", function() {
    it("should delete a table", function(done) {
      table.destroy(function(err, table) {
        should.not.exist(err)
        should.exist(table)

        table.should.have.property("status", "DELETING")

        done()
      })
    })
  })
})

