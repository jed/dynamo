var dynamo = require("../")
  , fetch = require("./fetch_credentials")
  , db

function done(err) { if (err) throw err }

function deleteTestTables() {
  console.log("deleting any existing tables...")

  var table1 = {TableName: "DYNAMO_TEST_TABLE_1"}
    , table2 = {TableName: "DYNAMO_TEST_TABLE_2"}

  db.deleteTable(table1, function() {
    db.deleteTable(table2, function() {
      checkNoTablesExist()
    })
  })
}

function checkNoTablesExist() {
  console.log("making sure no tables exist...")

  var table1 = {TableName: "DYNAMO_TEST_TABLE_1"}
    , table2 = {TableName: "DYNAMO_TEST_TABLE_2"}

  db.describeTable(table1, function(err, data) {
    if (!err) setTimeout(checkNoTablesExist, 5000)

    else !function check2() {
      db.describeTable(table2, function(err, data) {
        if (!err) setTimeout(check2, 5000)

        else {
          console.log("done.")
          process.exit(0)
        }
      })
    }()
  })
}

console.log("fetching credentials...")
fetch(function(err, data) {
  if (err) done(err)

  db = dynamo.createClient(data)

  deleteTestTables()
})