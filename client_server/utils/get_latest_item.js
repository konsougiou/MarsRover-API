var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});



const get_latest_rover = async(session_id) => {

	var table_name = 'POSITION_HISTORY_S'+session_id.toString()
    
	var first_item_params = {
		TableName: table_name,
		ExpressionAttributeValues: {
			':OBJECT_TYPE': {S: 'ROVER'},
		  },
		KeyConditionExpression: 'OBJECT_TYPE = :OBJECT_TYPE',  
		ProjectionExpression: 'X_POSITION , Y_POSITION',
		ScanIndexForward: false,
		Limit : 1
	};
	
	return await ddb.query(first_item_params).promise();
}

const get_latest_battery = async(session_id) => {

	var table_name = 'BATTERY_LEVEL_S'+session_id.toString()
    
	var first_item_params = {
		TableName: table_name,
		ExpressionAttributeValues: {
			':BATTERY_TYPE': {S: 'Li-ion_BATTERY'},
		  },
		KeyConditionExpression: 'BATTERY_TYPE = :BATTERY_TYPE',  
		ProjectionExpression: 'BATTERY_PERCENTAGE',
		ScanIndexForward: false,
		Limit : 1
	};

	return await ddb.query(first_item_params).promise();
}

const get_latest_alien = async(session_id) => {

	var table_name = 'EXTRATERRESTRIAL_POSITIONS_S'+session_id.toString()

	var first_item_params = {
		TableName: table_name,
		ExpressionAttributeValues: {
			':OBJECT_TYPE': {S: 'ALIEN'},
		  },
		KeyConditionExpression: 'OBJECT_TYPE = :OBJECT_TYPE',  
		ProjectionExpression: 'X_POSITION , Y_POSITION ,ID ',
		ScanIndexForward: false,
		Limit : 1
	};

	return await ddb.query(first_item_params).promise();
}

const get_latest_base = async(session_id) => {

	var table_name = 'EXTRATERRESTRIAL_POSITIONS_S'+session_id.toString()
    
	var first_item_params = {
		TableName: table_name,
		ExpressionAttributeValues: {
			':OBJECT_TYPE': {S: 'BASE'},
		  },
		KeyConditionExpression: 'OBJECT_TYPE = :OBJECT_TYPE',  
		ProjectionExpression: 'X_POSITION , Y_POSITION, ID',
		ScanIndexForward: false,
		Limit : 1
	};

	return await ddb.query(first_item_params).promise();
}

const get_latest_building = async(session_id) => {

	var table_name = 'EXTRATERRESTRIAL_POSITIONS_S'+session_id.toString()
    
	var first_item_params = {
		TableName: table_name,
		ExpressionAttributeValues: {
			':OBJECT_TYPE': {S: 'BUILDING'},
		  },
		KeyConditionExpression: 'OBJECT_TYPE = :OBJECT_TYPE',  
		ProjectionExpression: 'X_POSITION , Y_POSITION, ID',
		ScanIndexForward: false,
		Limit : 1
	};

	return await ddb.query(first_item_params).promise();
}


module.exports = {get_latest_rover, get_latest_battery, get_latest_alien, get_latest_base, get_latest_building}