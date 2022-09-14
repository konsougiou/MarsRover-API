// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
  AttributeDefinitions: [
    {
      AttributeName: 'OBJECT_TYPE',
      AttributeType: 'S'
    },
    {
      AttributeName: 'ID',
      AttributeType: 'N'
    }

  ],
  KeySchema: [
    {
      AttributeName: 'OBJECT_TYPE',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'ID',
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  },
  TableName: 'EXTRATERRESTRIAL_POSITIONS',
  StreamSpecification: {
    StreamEnabled: false
  }
};

// Call DynamoDB to create the table
ddb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table Created", data);
  }
});