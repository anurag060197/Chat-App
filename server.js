const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.use(express.static(__dirname+'/public'))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})

server.listen(port, () =>{
    console.log("server listening on port " + port);
})