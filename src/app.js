const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('New WebSocket connection');

    socket.emit('message',"Welcom!")
    
    socket.broadcast.emit('message',"New user has arrived!")
    
    socket.on('sendMessage',(msg, callback)=>{
        const filter = new Filter()

        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed!')
        }
        
        io.emit('message',msg)
        callback()
    })
    
    socket.on('sendLocation',(coords, callback)=>{
        io.emit('locationMessage',`https://google.com/maps?q=${coords.lat},${coords.long}`)
        callback()
    })
    
    socket.on('disconnect',()=>{
        io.emit('message',"A User has left")
    })
})

server.listen(port, ()=>{
    console.log(`Server active on port ${port}`);
})
