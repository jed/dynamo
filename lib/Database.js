var Request = require("./Request")
  , Tables = require("./Tables")

function log(err, data) {
  err
    ? console.warn(err)
    : console.log(data)
}

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

  listTables: function(options, cb) {
    this.request("ListTables", options, cb)
  },

  createTable: function(options, cb) {
    this.request("CreateTable", options, cb)
  },

  describeTable: function(options, cb) {
    this.request("DescribeTable", options, cb)
  },

  updateTable: function(options, cb) {
    this.request("UpdateTable", options, cb)
  },

  deleteTable: function(options, cb) {
    this.request("DeleteTable", options, cb)
  },

  scan: function(options, cb) {
    this.request("Scan", options, cb)
  },

  query: function(options, cb) {
    this.request("Query", options, cb)
  },

  batchGetItems: function(options, cb) {
    this.request("BatchGetItems", options, cb)
  },

  getItem: function(options, cb) {
    this.request("GetItem", options, cb)
  },

  putItem: function(options, cb) {
    this.request("PutItem", options, cb)
  },

  updateItem: function(options, cb) {
    this.request("UpdateItem", options, cb)
  },

  deleteItem: function(options, cb) {
    this.request("DeleteItem", options, cb)
  }
}

module.exports = Database