"use strict"

const solr = require('solr-client');
const countries = require('./countries');
const logger = require('./logger');

let client = solr.createClient('127.0.0.1', 8983, 'c0', '/solr');

var load = function() {
  logger.log.debug('Solr load called');
  countries.read(function(c) {
    logger.log.debug('Adding data for ', c.name);
    client.add(c, function(err, obj) {
      if (err) {
        logger.log.debug('Failed to add ',c);
        logger.log.debug('Error ', err);
      } else {
        logger.log.debug('Country successfully added to solr ', c.name);
        client.softCommit();
      }
    });
  });
}

var fetch = function(chars, callback) {
  let result = {
    name: "India",
    props: [
      {key: "Name", value: "Republic of India"},
      {key: "Continent", value: "ASIA"},
      {key: "Governance", value: "Parliamentary Democracy"},
      {key: "Population", value: "2-nd"},
      {key: "GDP", value: "5-th"},
      {key: "Index1", value: "3"},
      {key: "Index2", value: "78"}
    ]
  }
  callback(result);
}

var search = function(chars, callback) {
  let query = encodeURI(buildQuery(chars));
  client.search(query, function(err, obj) {
    let matched = [];
    let profiles = [];
    if (err) {
      callback(err);
    } else {
      let docs = obj.response.docs;
      if (docs.length > 0) {
        matcher(chars, docs, function(matched, profiles) {
          callback(null, matched, profiles);
        });
      }
    }
  })
}

var matcher = function(chars, docs, result) {
  let slashExist = isSlashExist(chars);
  let parent = extractParent(chars);
  let child = extractChild(chars);
  let matched = [];
  let profiles = [];
  if (!slashExist) {
    for (var idx = 0; idx < docs.length; idx++) {
      matched.push(docs[idx].name[0]);
    }
  } else {
    let cities = JSON.parse('[' + docs[0].cities + ']');
    for (var idx = 0; idx < cities.length; idx++) {
      let city = cities[idx];
      var regex = new RegExp(child, 'i');
      if (city.name.match(regex) || (!child && slashExist)) {
        let pushed  = city.name;
        let profile = 'State:' + city.state + ' Location:'+city.location;
        matched.push(parent + '/' + pushed);
        profiles.push(profile);
      }
    }
  }
  result(matched, profiles);
}

var buildQuery = function(chars) {
  let slashExist = isSlashExist(chars);
  let parent = extractParent(chars);
  let child = extractChild(chars);
  if (slashExist) {
      return 'q=name:' + parent + ' AND cities:*' + child + '*';
    } else {
      return 'q=name:*' + parent + '*';
    }
}

var extractChild = function(chars) {
  let slashIdx = chars.indexOf("/");
  if (slashIdx > 0 && chars.length > slashIdx + 1) {
      return chars.substring(slashIdx + 1);
  } else {
    return ''
  }
}

var extractParent = function(chars) {
  let slashIdx = chars.indexOf("/");
  if (slashIdx > 0) {
    return chars.substring(0, slashIdx);
  } else {
    return chars;
  }
}

var isSlashExist = function(chars) {
  return chars.indexOf("/") > 0;
}

module.exports = {
  load: load,
  search: search,
  fetch: fetch
}
