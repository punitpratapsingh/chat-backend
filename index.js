const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getByEmail,getAllUsers ,getUsersInRoom} = require('./users');

const router = require('./router');
const { connect } = require('http2');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);
io.origins('*:*') 
const myClientList = [];
io.on('connect', (socket) => {

  
 socket.on('UserRegister',({name,email,gender},callback)=>{

  
  let {error,user} =addUser({id:socket.id,name,email,gender});
  if(error)
  {
   return callback(error);
  }

  var list=getAllUsers(); 
  //io.to("").emit("userData",{users:list})  
  io.sockets.emit("userData",{users:list})  
    console.log(socket.id);
 
 })

 socket.on('sendMessageu2u', (messageBox, callback) => {
  const user = getUser(socket.id);
   if(!user) return callback();
  socket.emit("message", { ...messageBox,name:user.name });
  
   if(messageBox.to)
   {
  const User2=getByEmail(messageBox.to);

  //console.log(io.engine.clients[User2.id]);
  //console.log(io.connected[User2.id])
  //console.log(io.eio.clients[User2.id])
  io.to(User2.id).emit("message", { ...messageBox,name:user.name});
  //io.to('/#' + User2.id).emit("message", { ...messageBox,name:User2.name})
  //socket.to(User2.id).emit("message", { ...messageBox,name:User2.name});
 // io.sockets.socket(User2.id).emit("message", { ...messageBox,name:User2.name})
  //io.sockets.to(User2.id).emit("message", { ...messageBox,name:User2.name});
  //socket_server.sockets.socket(socket_id).emit(); 
 // io.to(`${User2.id}`).emit("message", { ...messageBox,name:User2.name});
  //io.sockets.sockets[User2.id].emit("message", { ...messageBox,name:User2.name});
  //var id=obj.id
  //console.log(id)
  //io.sockets.connected[id].emit("message", { ...messageBox,name:User2.name});
   }

  callback();
});




  socket.on('joinRoom', ({ room }, callback) => {
    
    socket.join(room);
    let user = getUser(socket.id);
    user.isInRoom=true;
    user.room=room

    socket.emit('message', { name: 'admin', message: `${user.name}, welcome to room ${user.room}.`,roomName:user.room});
    socket.broadcast.to(room).emit('message', { name: 'admin', message: `${user.name} has joined!`,roomName:user.room });

    

  });

  socket.on('sendMessage', (message, callback) => {
    let user = getUser(socket.id);

    console.log(user.room)
    io.to(user.room).emit('message', { name: user.name, message: message,roomName:user.room });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));