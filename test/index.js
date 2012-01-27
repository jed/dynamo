var http = require("http")
  , https = require("https")
  , should = require("should")
  , dynamo = require("../")

  , credentials
  , db
  , account
  , session

describe("Setup", function() {
  it("fetch AWS credentials", function(done) {
    var options = {host: process.env.npm_package_config_credentials}
      , body = ""
      , req
      , err

    req = https.get(options, function(res) {        
      res.on("data", function(chunk){ body += chunk })
      res.on("end", function() {
        try {
          credentials = JSON.parse(body)
          db = dynamo.createClient(credentials)

          should.exist(db)    
          db.should.be.a("object")      
        }
        
        catch (e) { err = e }

        done(err)
      })
    })

    req.on("error", done)
  })

  // return "UNCOMMENT TO REFRESH TABLES"

  it("delete any test tables (Database#deleteTable)", function(done) {
    var table1 = {TableName: "DYNAMO_TEST_TABLE_1"}
      , table2 = {TableName: "DYNAMO_TEST_TABLE_2"}

    db.should.have.property("deleteTable")

    db.deleteTable(table1, function() {
      db.deleteTable(table2, function() {
        done()
      })
    })
  })

  it("confirm that no test tables exist (Database#describeTable)", function check1(done) {
    var table1 = {TableName: "DYNAMO_TEST_TABLE_1"}
      , table2 = {TableName: "DYNAMO_TEST_TABLE_2"}

    db.should.have.property("describeTable")

    db.describeTable(table1, function(err, data) {
      if (!err) setTimeout(check1, 5000, done)

      else !function check2() {
        db.describeTable(table2, function(err, data) {
          if (!err) setTimeout(check2, 5000)

          else done()
        })
      }()
    })
  })

  it("recreate test tables (Database#createTable)", function(done) {
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

    db.should.have.property("createTable")

    db.createTable(table1, function(err, data) {
      err ? done(err) : db.createTable(table2, done)
    })
  })

  it("wait until databases are ready", function check1(done) {
    var table1 = {TableName: "DYNAMO_TEST_TABLE_1"}
      , table2 = {TableName: "DYNAMO_TEST_TABLE_2"}

    db.describeTable(table1, function(err, data) {
      if (err) done(err)

      else if (data.Table.TableStatus != "ACTIVE") setTimeout(check1, 5000, done)

      else !function check2() {
        db.describeTable(table2, function(err, data) {
          if (err) done(err)

          else if (data.Table.TableStatus != "ACTIVE") setTimeout(check2, 5000)

          else done()
        })
      }()
    })    
  })
})

describe("Database", function() {
  describe("#listTables", function() {
    it("should return a list of databases", function(done) {
      db.should.have.property("listTables")

      db.listTables({}, function(err, data) {
        should.not.exist(err)
        should.exist(data)
        data.should.have.property("TableNames")

        done()
      })
    })
  })
})