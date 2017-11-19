
var colNames = [
  'Field Name',
  'Field Type',
  'Definition',
  'Data Type',
  'Disp Format',
  'Alt Index',
  'Multiple',
  'Multilang'
];

module.exports = {
    parse: function(unparsed, callback) {
      // parse
      var arr = [...unparsed];
      for(i=0; i < unparsed.length; i++) {
        if (unparsed.charCodeAt(i) == 63741) {
          arr[i] = '$';
        } else if (unparsed.charCodeAt(i) == 63742) {
          arr[i] = '%';
        }
      }
      unparsed = arr.join("");
      var values = unparsed.split('%');
      var table = {};
      table.column = [];

      colNames.forEach(function(colName, colIdx) {
        var column = {};
        var mValues = (values[colIdx]).split('$');
        column.name = colName;
        column.value = [];
        console.log(column);
        mValues.forEach(function(mValue, mvIdx) {
          column.value[mvIdx] = mValue;
        });
        table.column[colIdx] = column;
      });
      console.log(JSON.stringify(table, null, 2));
      callback(null, table);
    }
  }
