const express = require("express");
const app = express();

const http = require('http');
const server = http.createServer(app);  // Create an HTTP server with the Express app

const { Server } = require("socket.io");
const io = new Server(server);  // Initialize Socket.IO with the HTTP server

app.get("/", (req, res) => {
    res.send("App");
});


let roomIdGlobal,imgUrlGlobal;

io.on('connection', (socket) => {
    
    socket.on("userJoined", (data) => {
        console.log(data);
        const { name, userId, roomId, host, presenter } = data;
        roomIdGlobal=roomId;
        socket.join(roomId);
        socket.emit("userIsJoined", {...data,success:true});
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{
            imgURL:imgUrlGlobal,
        })
    })

    socket.on("whiteboardData",(data)=>{
        imgUrlGlobal=data;
        socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse",{
            imgURL:data,
        })
    })
});


const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log('Server running on port ', port);
});