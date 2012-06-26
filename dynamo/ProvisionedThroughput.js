function ProvisionedThroughput(attrs, table) {
  Object.defineProperty(
    this, "table",
    {value: table, enumerable: false}
  )

  this.ReadCapacityUnits = attrs.read
  this.WriteCapacityUnits = attrs.write
}

ProvisionedThroughput.prototype = {
  update: function(attrs, cb) {
    var self = this

    this.ReadCapacityUnits = attrs.read
    this.WriteCapacityUnits = attrs.write

    return this.table.database.request(
      "UpdateTable",
      {
        TableName: this.table.TableName,
        ProvisionedThroughput: this.toJSON()
      },
      function(err, data) {
        if (err) return cb(err)

        cb(null, self.parse(data.TableDescription.ProvisionedThroughput))
      }
    )
  },

  parse: function(data) {
    if (data.LastIncreaseDateTime) {
      this.LastIncreaseDateTime = new Date(data.LastIncreaseDateTime * 1000)
    }

    if (data.LastDecreaseDateTime) {
      this.LastDecreaseDateTime = new Date(data.LastDecreaseDateTime * 1000)
    }

    this.ReadCapacityUnits = data.ReadCapacityUnits
    this.WriteCapacityUnits = data.WriteCapacityUnits

    return this
  }
}

module.exports = ProvisionedThroughput
