const express = require('express');
const app = express();
const http = require('http').Server(app);
const serverindex = require('serve-index');
const path = require('path');
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/tcu.html');
});
*/

io.on('connection', (socket) => {
  io.emit('connection', socket.id);
  socket.on('chat message', msg => {
    socket.broadcast.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
