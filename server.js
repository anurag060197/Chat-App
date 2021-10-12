const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3020;

app.use(express.static(__dirname+'/public'))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})

/* DB Connection */

const mongoose = require('mongoose');
const url = 'mongodb+srv://admin565:admin656@cluster0.czmw2.mongodb.net/Chat-DB?retryWrites=true&w=majority';

mongoose.connect(url, {useNewUrlParser: true}, {useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to Chat-DB...');
    })
    .catch(err => {
        console.log('Error connecting to Chat-DB: ' + err.message);
    })

/* DB Connection Ends */

/* Schema */

const Chats = require('./model/chatSchema');

/* Schema Ends */

/* Socket.io Setup */

const io = require('socket.io')(server);
let users = {};

io.on('connection', (socket)=>{
    Chats.find()
        .then(results=>{
            socket.emit("load messages", results);
        })
        
    socket.on('new-user-joined', (username)=>{
        const message = new Chats({
            username: username,
            status: "Joined",
            message: username + " joined the chat"
        })
        message.save()
            .then(()=>{
                users[socket.id] = username;
                socket.broadcast.emit('user-connected', username);
                io.emit("user-list", users);        
            })
    })

    socket.on("disconnect", ()=>{
        const message = new Chats({
            username: users[socket.id],
            status: "Left",
            message: users[socket.id] + " left the chat"
        })
        message.save()
            .then(()=>{
                socket.broadcast.emit('user-disconnected', users[socket.id]);
                delete users[socket.id];
                io.emit("user-list", users);
            })
    })

    socket.on("message", (data)=>{
        const message = new Chats({
            username: data.user,
            status: "Connected",
            message: data.msg
        })
        message.save()
            .then((result)=>{
                socket.emit('message', result, 'outgoing');
                socket.broadcast.emit('message', result, 'incoming');
            })
    })
})

/* Socket.io Setup Ends*/

server.listen(port, () =>{
    console.log("server listening on port: " + port);
})