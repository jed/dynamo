var should = require("should")
  , dynamo = require("../../")
  , db = dynamo.createClient({
      accessKeyId: process.env.npm_package_config_accessKeyId,
      secretAccessKey: process.env.npm_package_config_secretAccessKey
    })

describe("Tables", function() {
  describe("#fetch(fn)", function() {
    it("should return an array of tables", function(done) {
      db.tables.fetch(function(err, data) {
        should.not.exist(err)
        should.exist(data)

        data.should.have.property("length")
        data.length.should.be.above(1)

        data.should.have.property(0)
        data[0].should.have.property("database")

        done()        
      })
    })
  })

  describe("#fetch(num, fn)", function() {
    it("should return one table and have next fn", function(done) {
      var i = 0

      db.tables.fetch(1, function(err, data, next) {
        should.not.exist(err)
        should.exist(data)

        data.should.have.length(1)

        if (i++) {
          should.exist(next)
          next()
        }

        else done()
      })
    })
  })

  describe("#fetch(str, fn)", function() {
    it("should return the second test table", function(done) {
      var str = "DYNAMO_TEST_TABLE_1"
      db.tables.fetch(str, function(err, data) {
        should.not.exist(err)
        should.exist(data)

        data.should.have.property(0)
        data[0].should.have.property("name", "DYNAMO_TEST_TABLE_2")

        done()
      })
    })
  })
})

