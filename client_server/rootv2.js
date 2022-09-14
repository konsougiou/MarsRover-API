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
const {get_latest_rover, get_latest_battery, get_latest_alien, get_latest_base} = require('./utils/get_latest_item');
const  server  = require('http').createServer(app);
const io = require('socket.io')(server) 
app.use(express.static('public'));
app.use(express.urlencoded())
var session_id

let State = 'Start session'


app.set('views', __dirname + '/views');
app.set('view engine','ejs');


app.get('/' ,(req, res) => {
    res.render('home',{State: State})
})


server.listen(3001, () => {
    console.log('Server is listening on port 3001...')
})


io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id)

    async function EmitBattery() {

        try{
        const battery = (await get_latest_battery(session_id)).Items[0].BATTERY_PERCENTAGE.N;
    
        socket.emit('battery_message', battery )
        }
        catch(TypeError){}
            
    }
    async function initiate_map(){
        console.log(success)

    }
    
    async function EmitPosition() {

        try{
        const position = (await get_latest_rover(session_id)).Items[0];
        const test = position.X_POSITION.N
        socket.emit('position_message', position)
        }catch(TypeError){}
        }

    async function EmitAlienPosition() {

        try{

        const alien_position = (await get_latest_alien(session_id)).Items[0];
        const test = alien_position.X_POSITION.N
        socket.emit('alien_position_message', alien_position)
        }catch(TypeError){}
        
        }

     async function EmitBasePosition() {

        try{
        const base_position = (await get_latest_base(session_id)).Items[0];
        const test = base_position.X_POSITION.N
        socket.emit('base_position_message', base_position)
        }catch(TypeError){}
        }

        socket.on('coordinates', (data) => {
            if (State == 'Stop session') {
               var coordinate_params = start_params
                coordinate_params.Item.NEW_X.N = data.x
                coordinate_params.Item.NEW_Y.N = data.y
                coordinate_params.Item.SESSION_ID.N = session_id
                add_item(coordinate_params)

            }
        })
    
    
    
    
    if(State == 'Stop session'){

        EmitBattery();
        setInterval(EmitBattery, 10000);

        EmitPosition();
        setInterval(EmitPosition, 2000);

        EmitAlienPosition();
        setInterval(EmitAlienPosition, 1250);

        EmitBasePosition();
        setInterval(EmitBasePosition, 1250);
    }

    }

)

app.post('/',(req, res) => {

    if (State == 'Start session'){
        session_id = req.body.id
        session_params = start_params
        session_params.Item.SESSION_ID.N = session_id
        add_item(session_params)
        initiate_map()
        initiate_tables(session_id)

    State = 'Stop session'}
    else {add_item(stop_params)
        State = 'Start session'}

    res.render('home',{State: State})}
)


