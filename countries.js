"use strict"

const csv = require('fast-csv');
const fs = require('fs');

const logger = require('./logger');

function Country() {
    this.name;
    this.code
    this.cities = [];
};

function City() {
  this.name;
  this.code;
  this.state;
  this.location;
}

var read = function(callback) {

  var stream = fs.createReadStream("./countries.csv");
  let c = new Country();
  let totCountries = 0;
  var csvStream = csv()
    .on("data", function(data) {
        if (data[0] == '') {
         if (data[2] == '') {
           let name = data[3].substring(1);
           logger.log.debug('Init country', name);
           if (c.name) {
             totCountries++;
             callback(c);
             c = new Country();
           }
           c.name = name;
           c.code = data[1];
         } else {
           c.cities.push(JSON.stringify(buildCity(data)));
         }
       }
     })
    .on("end", function(){
         logger.log.debug("Loading of ",totCountries, "complete");
  });
  stream.pipe(csvStream);
}

var buildCity = function(data) {
  let city = new City();
  city.name = data[3];
  city.code = data[2];
  city.state = data[5];
  city.location = data[10];
  return city;
}

module.exports = {
  read: read
}
