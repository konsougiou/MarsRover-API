var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
app.use(express.json());

const add_item = async(input_params) => {

	return await ddb.putItem(input_params).promise();
}
module.exports = add_item 