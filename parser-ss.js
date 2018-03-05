"use strict"

const XmlParser = require('xml-stream');
const Readable = require('stream').Readable;

const logger = require('./logger');

var parse = function(xml, callback) {
  let stream = new Readable();
  stream.push(xml);
  stream.push(null);

  let parser = new XmlParser(stream);
  parser.preserve('d:verStandardSelection_SysFieldNameMvGroup/d:element', true);
  parser.collect('subitem');
  let obj = new Object();
  parser.on('endElement: d:element', function(item) {
    obj.name = item['d:SysFieldName'];
    obj.type
    if (fieldName) {
      arr.push(fieldName);
      callback(fieldName);
    }
  });
}

module.exports = {
  parse: parse
}
