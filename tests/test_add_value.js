var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var htmlParser = require('node-html-parser'); server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
let count = 0;
let htmlContent = ` <!DOCTYPE html> <html>

<body>
<h2>Enter a customer name</h2>
<form action="/primality-test" method="post" id="form1">
<!-- this is a comment: br tag is for line break--> <label for="num1">Input number:</label><br> <input type="text" id="num1" name="num1"><br>
<input type="submit" value="Check!"> </form>
</body> </html>
`;

server.get('/', function(req, res) { res.writeHead(200, {'Content-Type':'text/html'}); res.end(htmlContent);
});
server.post('/update_table', function(req, res) {

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const formData = req.body;
const responseContent = formData.num1; 
let htmlTree = htmlParser.parse(htmlContent);

var params = {
    TableName: 'TEST_DB',
    Item: {
      'CUSTOMER_ID' : {N: count.toString()},
      'CUSTOMER_NAME' : {S: responseContent}
    }
  };
  
  // Call DynamoDB to add the item to the table
  ddb.putItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
//formData is a JavaScript object
htmlTree.getElementById("form1").insertAdjacentHTML("afterend", name_added); res.writeHead(200, {'Content-Type':'text/html'});
res.end(htmlTree.toString());
count = count +1;
});
console.log('Server is running on port 3000'); server.listen(3000,'0.0.0.0');