const express = require('express')
const app = express()
var fileSystem = require("fs")
const path = require('path')
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const get_item = require('./utils/get_item');
const get_latest_item = require('./utils/get_latest_item');
const  server  = require('http').createServer(app);
const io = require('socket.io')(server) 
app.use(express.static('public'));


app.set('view engine','ejs');



var battery_params = {
    TableName: 'BATTERY_LEVEL',
    Key: {
      'CURRENT_TIME': {N: '1'},
    },
    ProjectionExpression: 'BATTERY_PERCENTAGE'
};

/*var position_params = {
    TableName: 'POSITION_HISTORY',
    KeyConditionExpression: 
      'OBJECT_TYPE = :OBJECT_TYPE',
    ExpressionAttributeValues : {
        ':OBJECT_TYPE' : 'ROVER'
    },
    ScanIndexForward: false
};*/

var first_item_params = {
    TableName: 'POSITION_HISTORY',
    ExpressionAttributeValues: {
        ':OBJECT_TYPE': {S: 'ROVER'},
      },
    KeyConditionExpression: 'OBJECT_TYPE = :OBJECT_TYPE',
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    
    ProjectionExpression: 'X_POSITION , Y_POSITION',
    ScanIndexForward: false,
    Limit : 1
};




app.get('/' ,(req, res) => {
    res.sendFile(path.join(__dirname, '/public/home_page.html'))
})

app.get('/Battery' ,(req, res) => {

    res.render(path.join(__dirname, '/public/battery_level.ejs'))
    //const battery = await get_item(params);
    //res.json(battery)


})
app.get('/Position' ,(req, res) => {

    res.render(path.join(__dirname, '/public/rover_position.ejs'))
})

server.listen(3000, () => {
    console.log('Server is listening on port 3000...')
})





io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id)

    async function EmitBattery() {
        const battery = (await get_item(battery_params)).Item.BATTERY_PERCENTAGE.N;
        socket.emit('battery_message', battery )
    
        }
    setInterval(EmitBattery, 5000);
    
    EmitBattery();

    async function EmitPosition() {
        const position = (await get_latest_item(first_item_params)).Items;
        
        socket.emit('position_message', position )
        }
    setInterval(EmitPosition, 2500);
        
     EmitPosition();
    

    }

)

