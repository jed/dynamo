var should = require("should")
  , dynamo = require("../")
  , db = dynamo.createClient()

console.log(process.env)

describe("setup", function() {
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

  it("recreate test tables", function(done) {
    var throughput = { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      , table1 = {
          TableName: "DYNAMO_TEST_TABLE_1",
          ProvisionedThroughput: throughput,
          KeySchema: {
            HashKeyElement: { AttributeName: "hash", AttributeType: "S" }
          }
        }

      , table2 = {
          TableName: "DYNAMO_TEST_TABLE_2",
          ProvisionedThroughput: throughput,
          KeySchema: {
            HashKeyElement: { AttributeName: "hash", AttributeType: "S" },
            RangeKeyElement: { AttributeName: "range", AttributeType: "N" }
          }
        }

    db.createTable(table1, function(err, data) {
      err ? done(err) : db.createTable(table2, done)
    })
  })

  it("wait for tables to activate", function check1(done) {
    var table1 = {TableName: "DYNAMO_TEST_TABLE_1"}
      , table2 = {TableName: "DYNAMO_TEST_TABLE_2"}

    db.describeTable(table1, function(err, data) {
      if (err) done(err)

      else if (data.Table.TableStatus != "ACTIVE") setTimeout(check1, 5000, done)

      else !function check2() {
        db.describeTable(table2, function(err, data) {
          if (err) done(err)

          else if (data.Table.TableStatus != "ACTIVE") setTimeout(check2, 5000, done)

          else done()
        })
      }()
    })    
  })
})