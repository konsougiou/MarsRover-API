var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});



/*var params = {
    TableName: 'TEST_DB',
    Key: {
      'CUSTOMER_ID': {N: '5'},
      'CUSTOMER_NAME': {S: '46'} 
    },
    ProjectionExpression: 'CUSTOMER_NAME'
};*/
  // Call DynamoDB to read the item from the table
const get_item = async() => {

  var battery_params = {
    TableName: 'BATTERY_LEVEL',
    Key: {
      'CURRENT_TIME': {N: '1'},
    },
    ProjectionExpression: 'BATTERY_PERCENTAGE'
};

	return await ddb.getItem(battery_params).promise();
}
module.exports = get_item 
