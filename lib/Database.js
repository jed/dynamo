var Request = require("./Request")
  , TableList = require("./TableList")
  , Table = require("./Table")

function Database() {
  function DatabaseTable(){ Table.apply(this, arguments) }
  DatabaseTable.prototype = new Table
  DatabaseTable.prototype.database = this

  function DatabaseTableList(){ TableList.apply(this, arguments) }
  DatabaseTableList.prototype = new TableList
  DatabaseTableList.prototype.database = this

  this.Table = DatabaseTable
  this.TableList = DatabaseTableList
  this.tables = new DatabaseTableList
}

Database.prototype = { 
  request: function request(target, data, cb) {
    var self = this
      , req = new Request(target, data)

    this.account.sign(req, function(err, req) {
      if (err) cb(err)

      else req.send(function(err, data) {
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