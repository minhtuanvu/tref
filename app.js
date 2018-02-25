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
  solr.search(req.query.key, function(err, matched) {
    res.end(JSON.stringify(matched));
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

// var matcher = function(key) {
//   let matches = [];
//   for (var idx = 0; idx < data.length; idx++) {
//     if (data[idx].search(key) >=0) {
//       matches.push(data[idx]);
//     }
//   }
//   return matches;
// }

// var data = [
//     "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
//     "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh",
//     "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia",
//     "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma",
//     "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad",
//     "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the",
//     "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
//     "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador",
//     "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
//     "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea",
//     "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India",
//     "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
//     "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos",
//     "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
//     "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
//     "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco",
//     "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
//     "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru",
//     "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino",
//     "Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone",
//     "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain",
//     "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan",
//     "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
//     "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
//     "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
// ]
