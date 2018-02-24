"use strict"

const solr = require('solr-client');
const countries = require('./countries');
const logger = require('./logger');

let client = solr.createClient('127.0.0.1', 8983, 'c0', '/solr');

var load = function() {
  logger.log.debug('Solr load called');
  countries.read(function(c) {
    logger.log.debug('Country ',JSON.stringify(c));
  });
  logger.log.debug('Read completed');

  // let data = {
  //   name: 'India',
  //   code: 'IN',
  //   cities: ['Ahmedabad', 'Bangalore', 'Chennai', 'Delhi']
  // }
  // logger.log.debug('Adding data ', data);
  //
  // client.add(data, function(err, obj) {
  //   if (err) {
  //     logger.log.debug('Error1:', err);
  //   } else {
  //     logger.log.debug('Obj1:', obj);
  //     client.softCommit();
  //   }
  // });
}

var search = function(chars, callback) {
  logger.log.debug('Solr search called');
  chars = '*' + chars + '*';
  client.search('q=name:'+chars, function(err, obj) {
    let matched = [];
    if (err) {
      logger.log.debug('Error2:', err);
    } else {
      logger.log.debug('Obj2:', );
    }
    let docs = obj.response.docs;
    logger.log.debug('Response', docs[0]);
    for (var idx = 0; idx < docs.length; idx++) {
      matched.push(docs[idx].name[0]);
    }
    callback(err, matched);
  }).setTimeout(200, function() {
    logger.log.debug('search timeout');
  });
}

module.exports = {
  load: load,
  search: search
}
