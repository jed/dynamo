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

  	var last = null
  	var pre_last = null

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

    it("should return only 3 items", function(done) {
      var _count = 3
      db.get("DYNAMO_TEST_TABLE_2")
        .query({
          id: "2",
          date: {">": 0}
        })
        .limit( _count )
        .fetch(function(err, items) {
          should.not.exist(err)
          should.exist(items)
          items.length.should.equal( _count )
          last = items[ _count - 1 ]
          pre_last = items[ _count - 2 ]
          done()
        })
    })

    it("should return the next 3 by cursor", function(done) {
      var _count = 3
      db.get("DYNAMO_TEST_TABLE_2")
        .query({
          id: "2",
          date: {">": 0}
        })
        .limit( _count )
        .cursor( { id: pre_last.id, date: pre_last.date } )
        .fetch(function(err, items) {
          should.not.exist(err)
          should.exist(items)
          var predicted_first = items[ 0 ]
          // the current first has to be the last of the preceding test
          predicted_first.should.eql( last )

          items.length.should.equal( _count )
          last = items[ _count - 1 ]
          pre_last = items[ _count - 2 ]
          done()
        })
    })

  })

})
