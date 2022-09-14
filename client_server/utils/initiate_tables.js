var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});


const initiate_tables = async(session_id) => {

    const create_alien_positions = async(session_id) => {

        table_name = 'EXTRATERRESTRIAL_POSITIONS_S'+ session_id.toString()
        
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
          TableName: table_name,
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
        
        }
        
        const create_rover_positions = async(session_id) => {
        
          table_name = 'POSITION_HISTORY_S'+ session_id.toString()
          
          var params = {
            AttributeDefinitions: [
              {
                AttributeName: 'OBJECT_TYPE',
                AttributeType: 'S'
              },
              {
                AttributeName: 'TIME',
                AttributeType: 'N'
              }
          
            ],
            KeySchema: [
              {
                AttributeName: 'OBJECT_TYPE',
                KeyType: 'HASH'
              },
              {
                AttributeName: 'TIME',
                KeyType: 'RANGE'
              }
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 10,
              WriteCapacityUnits: 10
            },
            TableName: table_name,
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
          
          }
        
          const create_battery_level = async(session_id) => {
        
            table_name = 'BATTERY_LEVEL_S'+ session_id.toString()
            
            var params = {
              AttributeDefinitions: [
                {
                  AttributeName: 'BATTERY_TYPE',
                  AttributeType: 'S'
                },
                {
                  AttributeName: 'TIME',
                  AttributeType: 'N'
                }
            
              ],
              KeySchema: [
                {
                  AttributeName: 'BATTERY_TYPE',
                  KeyType: 'HASH'
                },
                {
                  AttributeName: 'TIME',
                  KeyType: 'RANGE'
                }
              ],
              ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
              },
              TableName: table_name,
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
            
            }


    var battery_name = 'BATTERY_LEVEL_S'+ session_id.toString()
    var battry_params = {TableName: battery_name}

  try {
    
  return await ddb.describeTable(battry_params, function(err, data) {
        if (err) {
          console.log("initializing tables")
        } else {
          console.log("fetching session data")
        }
      }).promise();
    } catch(ResourceNotFoundException){
      create_battery_level(session_id);
      create_rover_positions(session_id);
      create_alien_positions(session_id);

    }

}



module.exports = initiate_tables