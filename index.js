'use strict';

const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const SaveUser = require('./modules/add-user');

const port = 3000;
const server = http.createServer(app);
const io = socketIO.listen(server);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//app.use(express.static(path.join(__dirname, 'node_modules')));

server.listen(port, () => {
   console.log('Express server listening on port %d in %s mode',
      port, app.get('env'));
});

io.on('connection', (socket) => {
  let userName = connectedUser();
  console.log(userName + ' started chat');
  let saveuser = new SaveUser();
  return saveuser.addUser(userName, socket.id).then(() => {
    handleConnection(socket, userName);
  });
});

app.get('/', (req, res) => {
  let pathToIndex = path.join(__dirname, 'index.html');
  res.sendFile(pathToIndex);
});

let connectedUser = (function() {
  let count = 0;
  return function() {return `user ${count++}`}
})();

function handleConnection(socket, userName) {
  console.log(socket.id + ' is connected');
  setListeners(socket, userName);
}

function setListeners(socket, userName) {
  // socket.on(socketEvents.common.CONNECT_ERROR, (err) => {
  //   logger.error(`Socket server connection error: ${err}`);
  // });

  socket.on('disconnect', function() {
    console.log(socket.id + ' ended chat');
  });

  socket.on('chat message', (message) => {
    console.log(`${userName} says \n${message}`);
    io.emit('chat message', 'Hi, This is Admin');
  });

}
