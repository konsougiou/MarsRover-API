const express = require('express')
const app = express()
var fileSystem = require("fs")
const path = require('path')
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const {start_params, stop_params} = require('./utils/json_params');
const initiate_tables = require('./utils/initiate_tables')
const add_item = require('./utils/ddb_add_item');
const table_to_array = require('./utils/table_to_array')
const {get_latest_rover, get_latest_battery, get_latest_alien, get_latest_base, get_latest_building} = require('./utils/get_latest_item');
const  server  = require('http').createServer(app);
const io = require('socket.io')(server) 
app.use(express.static('public'));
app.use(express.urlencoded())
var session_id
var alien_id_count = 0
var x_count = 9999
var y_count = 9999
var base_id_count = 0
var building_id_count = 0


let State = 'Start session'


app.set('views', __dirname + '/views');
app.set('view engine','ejs');


app.get('/' ,(req, res) => {
    res.render('home',{State: State})
})

app.post('/',(req, res) => {

    if (State == 'Start session'){
        session_id = req.body.id
        session_params = start_params
        session_params.Item.SESSION_ID.N = session_id
        add_item(session_params)
        initiate_tables(session_id)
    State = 'Stop session'}
    else {add_item(stop_params)
        State = 'Start session'
        }

    res.render('home',{State: State})}
)

server.listen(3001, () => {
    console.log('Server is listening on port 3001...')
})


io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id)
    alien_id_count = 0
    x_count = 9999
    y_count = 9999
    base_id_count = 0

    async function EmitBattery() {

        try{
        const battery = (await get_latest_battery(session_id)).Items[0].BATTERY_PERCENTAGE.N;
    
        socket.emit('battery_message', battery )
        }
        catch(TypeError){}
            
    }
    
    async function EmitPosition() {

        try{
        const position = (await get_latest_rover(session_id)).Items[0];
        var new_x = parseInt(position.X_POSITION.N,10)
        var new_y = parseInt(position.Y_POSITION.N,10)
        if ((new_x!=x_count)||(new_y!=y_count)){
            console.log('position emmited')
        socket.emit('position_message', position)
        x_count = new_x
        y_count = new_y
        }
        }catch(TypeError){}
        }

    async function EmitAlienPosition() {

        try{
        
        const alien_position = (await get_latest_alien(session_id)).Items[0];
        var new_alien_id = parseInt(alien_position.ID.N,10)
        if (new_alien_id>alien_id_count){
            console.log('alien position emmited')
            socket.emit('alien_position_message', alien_position)
            alien_id_count = new_alien_id
            }
        }catch(TypeError){}
        
        }

     async function EmitBasePosition() {

        try{
        const base_position = (await get_latest_base(session_id)).Items[0];
        var new_base_id = parseInt(base_position.ID.N,10)
        if (new_base_id>base_id_count){
            console.log('base position emmited')
            socket.emit('base_position_message', base_position)
            base_id_count = new_base_id
            }
        }catch(TypeError){}
        }

     async function EmitBuildingPosition() {

        try{
        const building_position = (await get_latest_building(session_id)).Items[0];
        var new_building_id = parseInt(building_position.ID.N,10)
        if (new_building_id>building_id_count){
            console.log('building position emmited')
            socket.emit('building_position_message', building_position)
            building_id_count = new_building_id
            }
        }catch(TypeError){}
         }



     async function Fetch_session_data() {

        const data = []
        const alien_positions = await table_to_array('EXTRATERRESTRIAL_POSITIONS_S', 'ALIEN', session_id)
        const base_positions = await table_to_array('EXTRATERRESTRIAL_POSITIONS_S', 'BASE', session_id)
        const building_positions = await table_to_array('EXTRATERRESTRIAL_POSITIONS_S', 'BUILDING', session_id)
        data.push(alien_positions)
        data.push(base_positions)
        data.push(building_positions)

        socket.emit('fetched_positions', data )

     }

        socket.on('coordinates', (data) => {
            if (State == 'Stop session') {
               var coordinate_params = start_params
                coordinate_params.Item.NEW_X.N = data.x
                coordinate_params.Item.NEW_Y.N = data.y
                coordinate_params.Item.SESSION_ID.N = session_id
                coordinate_params.Item.CONTROL_STATE.S = "REMOTE"
                add_item(coordinate_params)

            }
        })

        socket.on('control_state', (data) => {
                
                    var control_state_params = {
                        "TableName": "REMOTE_CONTROL",
                        "Item": {
                          "ID" : {"N": "0"
                              },
                          "EVENT_TYPE" : {"S": "REMOTE_COMMAND"
                              },
                          "EVENT" : {"S": "START"
                              },
                            "NEW_X" : {"N": "9999"
                            },
                            "NEW_Y" : {"N": "9999"
                            },
                            "SESSION_ID": {"N": '9999'
                          },
                          "CONTROL_STATE": {"S": 'AUTOPILOT'
                          }   
                          }
                      }
                    control_state_params.Item.SESSION_ID.N = session_id
                    control_state_params.Item.CONTROL_STATE.S = data
                    add_item(control_state_params)
        })
    
    
    
    
    if(State == 'Stop session'){
        
        setTimeout(Fetch_session_data, 1000);

        EmitBattery();
        setInterval(EmitBattery, 15000);

        EmitPosition();
        setInterval(EmitPosition, 2000);

        EmitAlienPosition();
        setInterval(EmitAlienPosition, 1000);

        EmitBasePosition();
        setInterval(EmitBasePosition, 2000);

        EmitBuildingPosition();
        setInterval(EmitBuildingPosition, 2000);

    }

    }

)







