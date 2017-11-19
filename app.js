var express = require('express');
var fs = require('fs');
var path = require('path');
var db = require('mongoose');
var bodyParser = require('body-parser');

var data = require('./data-h2');
var parser = require('./data-parser');
var app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static Path
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function() {
  console.log('Server started and listening on port 3000');
});

var header = {
  field: 'Field Name',
  multiplicity: 'Multiplicity',
  type: 'Type'
};

var rows = [{
  field: 'NAME',
  multiplicity: 'S',
  type: 'IN2D'
}, {
  field: 'SHORT.NAME',
  multiplicity: 'multi',
  type: 'string'
}];

app.get('/app', function(req, res) {
  var app = req.query.id;
  data.rs(app, function(err, resultsObj) {
    var resJson = JSON.parse(JSON.stringify(resultsObj));
    parser.parse(resJson[1][0].STRRECORD, function(err, table) {
      res.render('app', {
      title: app,
      table: table
      });
    })
    console.log('After calling rs');
  });
});
