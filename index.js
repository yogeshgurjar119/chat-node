const express = require("express");
const app = express();
require("dotenv").config();
const socketIO = require("socket.io");

const SERVER_PORT = 5000
const server = app.listen(SERVER_PORT, () => {
  console.log(`Server is running on:- ${SERVER_PORT}`);
});


const io = socketIO(server)

let  activeUsers = new Set();

io.on("connection",(socket)=>{
  console.log("User socket connection ")
  socket.on("new user",(data)=>{
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user",[...activeUsers])   //spread add all user 
  })


  //emit => send on => receive
socket.on("chat message",(data)=>{
  io.emit("chat message",data)
})

//reserver disconnect  connection event in socket
socket.on("disconnect",()=>{
  activeUsers.delete(socket.userId)
  io.emit("user disconnected",socket.userId)
})

socket.on("typing",(data)=>{
  socket.broadcast.emit("typing",data)
})
})   //listen event on()  and work for evenvt


//static files
app.use(express.static("public"))
