"use strict"

const t24fetcher = require('./t24-fetcher');
const logger = require('./logger');
const solr = require('./t24-data-solr');

var load = function(callback) {
  t24fetcher.count('StandardSelections', function(count) {
    if (typeof count != 'number') {
      callback("Failed to load. Count is not a number", count);
      return;
    }
    for (var i=0;i<40; i+=20) {
      logger.log.debug('Fetching for',i,'to',i+20,'of',count);
      t24fetcher.fetch('StandardSelections', 20, function(result) {
        for (var k in result) {
          logger.log.debug("Loading for",k, result[k].file);
          solr.insert(result[k]);
        }
      });
    }
    callback("Total loaded " + count);
  });
}

module.exports = {
  load:load
}
