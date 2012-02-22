var should = require("should")
  , dynamo = require("../")
  , db = dynamo.createClient()

describe("setup -", function() {
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

  it("create test table with defaults", function(done) {
    db.add({name: "DYNAMO_TEST_TABLE_1"})
      .save(function(err, table) {
	should.not.exist(err)
	should.exist(table)

	table.should.have.property("TableName", "DYNAMO_TEST_TABLE_1")

	table.should.have.property("KeySchema")
	table.KeySchema.should.have.property("HashKeyElement")
	table.KeySchema.HashKeyElement.should.have.property("AttributeName", "id")
	table.KeySchema.HashKeyElement.should.have.property("AttributeType", String)

	table.should.have.property("ProvisionedThroughput")
	table.ProvisionedThroughput.should.have.property("ReadCapacityUnits", 3)
	table.ProvisionedThroughput.should.have.property("WriteCapacityUnits", 5)

	done()
      })
  })

  it("create test table with attributes", function(done) {
    db.add({
	name: "DYNAMO_TEST_TABLE_2",
	schema: {id: String, date: Number},
	throughput: {read: 4, write: 6}
      })
      .save(function(err, table) {
        should.not.exist(err)
        should.exist(table)

	table.should.have.property("TableName", "DYNAMO_TEST_TABLE_2")

        table.should.have.property("KeySchema")
	table.KeySchema.should.have.property("HashKeyElement")
	table.KeySchema.HashKeyElement.should.have.property("AttributeName", "id")
	table.KeySchema.HashKeyElement.should.have.property("AttributeType", String)
        table.KeySchema.should.have.property("RangeKeyElement")
        table.KeySchema.RangeKeyElement.should.have.property("AttributeName", "date")
	table.KeySchema.RangeKeyElement.should.have.property("AttributeType", Number)

	table.should.have.property("ProvisionedThroughput")
	table.ProvisionedThroughput.should.have.property("ReadCapacityUnits", 4)
	table.ProvisionedThroughput.should.have.property("WriteCapacityUnits", 6)

        done()
      })
  })

  it("wait for tables to activate", function(done) {
    db.get("DYNAMO_TEST_TABLE_1").watch(function() {
      db.get("DYNAMO_TEST_TABLE_2").watch(function() {
	done()
      })
    })
  })
})
