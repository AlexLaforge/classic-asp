// ADO Wrapper
req(uire('util/makeClass'));
req(uire('util/functions'));

var DB = {

  getRows: function(recordset){
    var rows = [];
    recordset.MoveFirst()
    while (recordset.EOF != true){
      var attributes = {};
      for (var i = 0; i < recordset.Fields.Count; i++){
        var field = recordset.Fields(i);
        attributes[field.name] = field.value;
      }
      rows[rows.length] = attributes;
      recordset.MoveNext();
    }
    return rows;
  }

};

DB.Column = makeClass();
DB.Column.prototype = {
  init: function(options){
    for (var key in options)
      this[key.toLowerCase().replace(/^column_/, '')] = options[key];
  }
};

DB.Table = makeClass();
DB.Table.prototype = {
  init: function(options){
    for (var key in options)
      this[key.toLowerCase().replace(/^table_/, '')] = options[key];
  }
};

DB.Connection = makeClass();
DB.Connection.prototype = {

  // we only use ODBC DSNs for now
  init: function(dsn){
    this.dsn = dsn;
  },

  tables: function(){
    if (this._tables == null){
      var rs       = this._conn().OpenSchema(20); // all tables
      var rows     = DB.getRows(rs);
      this._tables = map(rows, function(row){ return new DB.Table(row); });
    }
    return this._tables;
  },

  columns: function(table_name){
    var rs      = this._conn().OpenSchema(4); // all columns
    var rows    = DB.getRows(rs);
    var columns = map(rows, function(row){ return new DB.Column(row); });
    if (table_name != undefined)
      columns = select(columns, function(column){ return column.table_name == table_name; });
    return columns;
  },

  _conn: function(){
    if (this._connection == null && this.dsn != null){
      this._connection = Server.CreateObject("ADODB.Connection");
      this._connection.Open(this.dsn);
    }
    return this._connection;
  }
}

// returns a new connection object that uses an ODBC System DSN
DB.odbc = function(dsn){
  return new DB.Connection(dsn);
}