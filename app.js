var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(1337);

function handler (req, res) {
  fs.readFile(__dirname + '/simplechat.js',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error retrieving simplechat');
    }

    res.writeHead(200, {'Content-Type':'text/javascript'});
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('message', { name: 'Kashif', message: 'Hello World'});
  socket.on('message', function (data) {
    console.log("%s: %s", data.name, data.message);
    socket.emit('message', { name: data.name, message: data.message});
    socket.emit('message', { name: 'Kashif', message: data.message + '!'});
  });
});