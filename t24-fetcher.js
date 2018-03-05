"use strict"

const urlBuilder = require('build-url');
const request = require('request');
const logger = require('./logger');

const baseUrl = 'http://localhost:9089/Metadata-iris/Metadata.svc/GB0010001/v1/applications/';

var fetch = function(resource, top, callback) {
  logger.log.debug('Processing for');
  const options = {
    url: baseUrl + resource + '?$inlinecount=allpages&$top=' + top,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Basic ' + Buffer.from("SSOUSER1" + ':' + "123456").toString('base64')
    }
  }

  logger.log.debug('Invoking T24 api for', options);

  request(options, function(err, res, body) {
    let response = '';
    if (err) {
      logger.log.debug('Failed to GET from T24.',err);
      response = err;
    } else if (res.statusCode === 200) {
      let jbody = JSON.parse(body);
      response = jbody._embedded.item;
    } else {
      response = body;
      logger.log.debug('Failed to GET from T24. Status code',res.statusCode);
    }
    callback(response);
  });
}

var count = function(resource, callback) {
  logger.log.debug('Processing count for', resource);
  const options = {
    url: baseUrl + resource + '?$inlinecount=allpages&$top=0',
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Basic ' + Buffer.from("SSOUSER1" + ':' + "123456").toString('base64')
    }
  }

  logger.log.debug('Invoking T24 api to count for', resource);

  request(options, function(err, res, body) {
    let response = '';
    if (err) {
      logger.log.debug('Failed to GET from T24.',err);
      response = err;
    } else if (res.statusCode === 200) {
      let jbody = JSON.parse(body);
      response = parseInt(jbody.count);
    } else {
      response = body;
      logger.log.debug('Failed to GET from T24. Status code',res.statusCode);
    }
    callback(response);
  });
}

module.exports = {
  fetch: fetch,
  count: count
}
