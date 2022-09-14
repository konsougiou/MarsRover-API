const express = require('express')
const app = express()
var fileSystem = require("fs")
const path = require('path')
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const add_item = require('./utils/ddb_add_item');
const get_state = require('./utils/ddb_get_state');
const {start_params, stop_params} = require('./utils/json_params');
app.use(express.json());

var session_id = 9999


app.post('/' , (req, res) => {
    const input_params = req.body
    console.log(input_params)
    console.log(session_id)
    input_params.TableName = input_params.TableName + '_S' + session_id.toString()
    res.json(input_params)
    add_item(input_params)
})

app.get('/', async (req, res) => {
    var control_params =(await get_state()).Item
    session_id = control_params.SESSION_ID.N
    res.send(control_params)
   /* if (control_params.EVENT.S == 'START'){
    var reset_coordinate_params = start_params
    reset_coordinate_params.Item.SESSION_ID.N = session_id.toString()
    add_item(reset_coordinate_params)}*/
})


app.listen(5000, () => {
    console.log('Server is listening on port 5000...')
})


