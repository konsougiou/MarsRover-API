

function EmitBattery(count) {
    socket.emit('message', count.toString())
    count = count + 1
    }

setInterval(EmitBattery, 1500);    

module.exports = EmitBattery