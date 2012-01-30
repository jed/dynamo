var Request = require("./Request")
  , Tables = require("./Tables")


function Database() {
  this.tables = new Tables
  this.tables.database = this
}

Database.prototype = {
    )
  request: function request(target, data, cb) {
      , req = new Request(target, data)
      if (err) cb(err)
        if (!err || err.statusCode >= 500) cb(err, data)

        else cb(err, data, request.bind(self, target, data, cb))
      })
    })
  },

  listTables: function(data, cb) {
    this.request("ListTables", data, cb)
  },

  createTable: function(data, cb) {
    this.request("CreateTable", data, cb)
  },

  describeTable: function(data, cb) {
    this.request("DescribeTable", data, cb)
  },

  updateTable: function(data, cb) {
    this.request("UpdateTable", data, cb)
  },

  deleteTable: function(data, cb) {
    this.request("DeleteTable", data, cb)
  },

  scan: function(data, cb) {
    this.request("Scan", data, cb)
  },

  query: function(data, cb) {
    this.request("Query", data, cb)
  },

  batchGetItems: function(data, cb) {
    this.request("BatchGetItems", data, cb)
  },

  getItem: function(data, cb) {
    this.request("GetItem", data, cb)
  },

  putItem: function(data, cb) {
    this.request("PutItem", data, cb)
  },

  updateItem: function(data, cb) {
    this.request("UpdateItem", data, cb)
  },

  deleteItem: function(data, cb) {
    this.request("DeleteItem", data, cb)
  }
}

module.exports = Database