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
  request: function(target, data, cb) {
    this.account.sign(
      new Request(target, data),
      function(err, request) {
        err ? cb(err) : request.send(cb || log)
      }
    )
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