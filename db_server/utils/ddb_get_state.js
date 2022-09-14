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

  var state_params = {
    TableName: 'REMOTE_CONTROL',
    Key: {
      'EVENT_TYPE': {S: 'REMOTE_COMMAND'},
      "ID": {N: '0'}
    },
    ProjectionExpression: 'EVENT, NEW_X, NEW_Y, SESSION_ID, CONTROL_STATE'
};

	return await ddb.getItem(state_params).promise();
}


module.exports = get_item
