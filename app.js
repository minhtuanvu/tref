const express = require('express');
const solr = require('./data-solr');
const logger = require('./logger');

const app=express();

app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/',function(req,res){
res.render('index.html');
});

app.get('/search',function(req,res) {
  solr.search(req.query.key, function(err, matched, profiles) {
    res.end(JSON.stringify(matched));
  });
});

app.get('/fetch',function(req,res) {
  solr.fetch(req.query.key, function(result) {
    logger.log.debug('returning', result);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
});

app.get('/load', function(req, res) {
  logger.log.debug('Load requsted');
  solr.load();
  res.status(200).send('Loading completed!');
});

var server=app.listen(3000,function(){
  logger.log.debug("Server started and listening on port 3000");
});
