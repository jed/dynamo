var should = require("should")
  , dynamo = require("../../")
  , client = dynamo.createClient()
  , db = client.get("us-east-1")

describe("Table", function() {
  describe("#get", function() {
    it("should return an item", function() {
      var item = db.get("DYNAMO_TEST_TABLE_1").get({id: "0"})

      item.should.have.property("Key")
    })
  })

  describe("#fetch()", function() {
    it("should return a table", function(done) {
      db.get("DYNAMO_TEST_TABLE_1").fetch(function(err, table) {
        should.not.exist(err)
        should.exist(table)

        table.should.have.property("TableName", "DYNAMO_TEST_TABLE_1")
        done()
      })
    })
  })

  describe("#scan", function() {
    it("should return matching items", function(done) {
      db.get("DYNAMO_TEST_TABLE_1")
        .scan({
          name: {"in": ["Paul", "George"]},
          id: {">": "2"}
        })
        .fetch(function(err, items) {
          should.not.exist(err)
          should.exist(items)
          items.should.have.property("0")
          items[0].should.have.property("id", "3")
          items[0].should.have.property("name", "George")

          done()
        })
    })
  })

  describe("#query", function() {
    it("should return matching items", function(done) {
      db.get("DYNAMO_TEST_TABLE_2")
        .query({
          id: "2",
          date: {">": new Date - 60000}
        })
        .fetch(function(err, items) {
          should.not.exist(err)
          should.exist(items)

          items
            .filter(function(item){ return item.id === "2" })
            .should.have.length(items.length)

          items
            .filter(function(item){ return item.date < new Date - 60000 })
            .should.have.length(items.length)

          done()
        })
    })
  })

})
