var should = require("should")
  , dynamo = require("../")
  , db = dynamo.createClient()

  , table1 = new db.Table({
      name: "DYNAMO_TEST_TABLE_1",
      schema: {id: Number}
    })

  , table2 = new db.Table({
      name: "DYNAMO_TEST_TABLE_2",
      schema: {user: Number, date: String}
    })

describe("setup -", function() {
  it("delete any existing tables", function(done) {
    table1.destroy(function() {
      table2.destroy(function() {
        done()
      })      
    })
  })

  it("make sure no tables exist", function check1(done) {
    table1.fetch(function(err, data) {
      if (!err) setTimeout(check1, 5000, done)

      else !function check2() {
        table2.fetch(function(err, data) {
          err ? done() : setTimeout(check2, 5000, done)
        })
      }()
    })
  })

  it("recreate test tables", function(done) {
    table1.create(function(err, table) {
      should.not.exist(err)
      should.exist(table)

      table.should.have.property("TableName", table1.TableName)

      table.should.have.property("ProvisionedThroughput")
      table.ProvisionedThroughput.should.have.property("ReadCapacityUnits", 3)
      table.ProvisionedThroughput.should.have.property("WriteCapacityUnits", 5)

      table.should.have.property("KeySchema")
      table.KeySchema.should.have.property("HashKeyElement")
      table.KeySchema.HashKeyElement.should.have.property("AttributeName", "id")
      table.KeySchema.HashKeyElement.should.have.property("AttributeType", "N")

      table1 = table

      table2.create(function(err, table) {
        should.not.exist(err)
        should.exist(table)

        table.should.have.property("KeySchema")
        table.KeySchema.should.have.property("RangeKeyElement")
        table.KeySchema.RangeKeyElement.should.have.property("AttributeName", "date")
        table.KeySchema.RangeKeyElement.should.have.property("AttributeType", "S")

        table2 = table
        done()
      })
    })
  })

  it("wait for tables to activate", function(done) {
    table1.watch(function(err) {
      err ? done(err) : table2.watch(done)
    })
  })
})