var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});


 const ScanTable = async (table_name,object_type,session_id) => {

    var session_table_name = table_name+session_id.toString()

	var first_item_params = {
		TableName: session_table_name,
		ExpressionAttributeValues: {
			':OBJECT_TYPE': {S: object_type},
		  },
		KeyConditionExpression: 'OBJECT_TYPE = :OBJECT_TYPE',  
		ProjectionExpression: 'X_POSITION , Y_POSITION',
	};
    scanResults = []
try{
    const result = await ddb.query(first_item_params).promise();
    result.Items.forEach((item) => scanResults.push(item));
}catch(ResourceNotFoundException){}
    
    return scanResults
};

module.exports = ScanTable

