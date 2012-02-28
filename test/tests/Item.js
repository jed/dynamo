var should = require("should")
  , dynamo = require("../../")
  , db = dynamo.createClient()

describe("Item", function() {
  describe("#fetch", function() {
    it("should return the item's attributes", function(done) {
      var item = db.get("DYNAMO_TEST_TABLE_1").get({id: "0"})

      item.fetch(function(err, data) {
        should.not.exist(err)
        should.exist(data)

        data.should.have.property("id")
        data.should.have.property("favoriteColors")
        data.should.have.property("name")

        done()
      })
    })
  })
})
