var should = require("should")
  , dynamo = require("../../")
  , client = dynamo.createClient()
  , db = client.get("us-east-1")

describe("Database", function() {
  describe("#get()", function() {
    it("should return the appropriate object", function() {
      var table = db.get("table")
        , batch = db.get(function(){})
        , item = db.get("table", {id: 123})

      table.should.have.property("TableName", "table")
      table.should.have.property("database", db)

      batch.should.have.property("RequestItems")
      batch.should.have.property("database", db)

      item.should.have.property("TableName", "table")
      item.should.have.property("Key")
      item.should.have.property("database", db)
    })
  })

  describe("#add()", function() {
    it("should return a table", function() {
      var table = db.add({name: "table", schema: {id: 123}})

      table.should.have.property("TableName", "table")
      table.should.have.property("KeySchema")
    })
  })

  describe("#put()", function() {
    it("should return an update", function() {
      var update = db.put("table", {id: 123})

      update.should.have.property("TableName", "table")
      update.should.have.property("Item")
      update.Item.should.have.property("id")
    })
  })

  describe("#fetch()", function() {
    it("should return a hash of tables", function(done) {
      db.fetch(function(err, database) {
        should.not.exist(err)
        should.exist(database)
        database.should.equal(db)

        database.should.have.property("tables")

        database.tables.should.have.property("DYNAMO_TEST_TABLE_1")
        database.tables.should.have.property("DYNAMO_TEST_TABLE_2")

        done()
      })
    })
  })
})
