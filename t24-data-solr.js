"use strict"

const solr = require('solr-client');
const logger = require('./logger');

let client = solr.createClient('127.0.0.1', 8983, 't0', '/solr');

var insert = function(rec) {
  logger.log.debug('Adding data for ', rec.file);
  rec.fields = JSON.stringify(rec.fields);
  client.add(rec, function(err, obj) {
    if (err) {
      logger.log.debug('Failed to add ',rec);
      logger.log.debug('Error ', err);
    } else {
      logger.log.debug('Successfully added to solr ', rec.file);
      client.softCommit();
    }
  });
}

module.exports = {
  insert: insert
}
