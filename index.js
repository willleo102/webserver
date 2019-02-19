
// Import the express javascript library
var express = require('express');

// Instantiate a server
var app = express();

const { byName, byYear } = require('us-baby-names');

// Transform the data object elements into an
// HTML table
const formatToHTML = function(dataArr) {
  // If dataArr is undefined or null, make an empty array
  if (!dataArr) {
    dataArr = [];
  }
  // Use the Array.map function to convert each record 
  // into an HTML table element.
  dataArr = dataArr.map(item => {
    // Create the HTML here
    let html = '<tr>'
    html += (item.year) ? '<td>'+item.year+'</td>' : '';
    html += (item.name) ? '<td>'+item.name+'</td>' : '';
    html += (item.sex) ? '<td>'+item.sex+'</td>' : '';
    html += (item.count) ? '<td>'+item.count+'</td>' : '';
    html += '</tr>';
    return html
  })
  // Now join all the elements together inside the 
  // <table><tbody> elements.
  return '<table><tbody>'+
    dataArr.join('')+'</tbody></table>';
}


// Transform name with first character capitalized and the 
// rest lower case
const fixName = function(name) {
  let newName = name.toLowerCase();
  newName = newName.charAt(0).toUpperCase() +
    newName.substr(1)
  return newName
}


// Set the port number to be compatible with Cloud 9
const PORT = 8080;

 app.use(function (req, res, next) {
  console.log('Additional processing is done here');
  req.timestamp = new Date().toString();
  next();
})


app.get('/dog/:breed', function (req, res) {
  res.send('This is the dog route and the breed was '+req.params.breed);
})



// Respond with "hello world" when a GET request is made
app.get('/', function (req, res) {
  // Send the text back to the client in response to the request
   res.append('Content-Type', 'text/html');
  res.send('<html><head></head><body>'+
    '<h1>Hello World!</h1>'+
    '<h3>My server is working!!!</h3>'+
    '<h5>'+req.timestamp+'</h5></body></html>');

  // Log a message to the terminal window
  console.log((new Date()).toString()+' Message served to the client');
})

app.get('*', function (req, res) {
  res.send('This part runs if no other paths catch it');
})


// Path 1: /baby-name/<name>
app.get('/baby-name/:name', function(req, res) {
  let data = byName[fixName(req.params.name)];
  res.send(formatToHTML(data));
})

// Path 2: /baby-name/<name>/<year>
app.get('/baby-name/:name/:year', function(req, res) {
  let data = byName[fixName(req.params.name)];
  if (!data) data = [];
  // Check to see if the year matches what's requested.
  // item.year is a number but req.params.year is a string
  // so we need to add '' to the number to convert it to 
  // a string so that the types match when they're compared
  data = data.filter(item => item.year+'' === req.params.year);
  res.send(formatToHTML(data));
})

// Path 7: /baby-year-start/<year>/<letter>
// Babies born in <year> and names starting with <letter>
app.get('/baby-year-start/:year/:letter', function(req, res) {
  let data = byYear[req.params.year];
  if (!data) data = [];
  data = data.filter(item => item.name.charAt(0).toLowerCase() === req.params.letter.toLowerCase());
  data = data.sort((a,b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  })
  res.send(formatToHTML(data));
})



// Set up the server to 'listen' to requests on port 8080
// Requests to virtual machines running on Cloud 9 will use
// port 8080 by default.  You can force a URL request to a
// specific port by adding :nnnn to the end of the URL
app.listen(PORT, function () {
  // This function executes when a request is heard from the client
  console.log('Example app listening on port ' + PORT + '!');;
});


