"use strict"

const csv = require('fast-csv');
const fs = require('fs');

const logger = require('./logger');

function Country() {
    this.name;
    this.code
    this.cities = [];
};

var read = function(callback) {

  var stream = fs.createReadStream("./countries0.csv");
  let c = new Country();
  var csvStream = csv()
    .on("data", function(data) {
        logger.log.debug(data);
         if (data[2] == '') {
           logger.log.debug('Init country ',data[2]);
           if (!c.name) {
             callback(c);
             c = new Country();
           }
           c.name = data[3];
           c.code = data[1];
         } else {
           c.cities.push(data[3]);
         }
    })
    .on("end", function(){
         console.log("done");
  });
  stream.pipe(csvStream);
}

var parse = function(rawData) {

}

module.exports = {
  read: read
}
