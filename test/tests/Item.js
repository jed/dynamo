var should = require("should")
  , dynamo = require("../../")
  , client = dynamo.createClient()
  , db = client.get("us-east-1")

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

  describe("#destroy", function() {
    it("should delete the item", function(done) {
      var item = db.get("DYNAMO_TEST_TABLE_1").get({id: "0"})

      item.destroy(function(err, data) {
        should.not.exist(err)

        done()
      })
    })
  })

})
