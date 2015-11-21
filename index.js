// Socket Simon
// By Nick Martini 
// and Dan Hart

var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var app = express();
var server = app.listen(3000, function(){
	console.log('listening on *:3000');
});
var io = require('socket.io').listen(server);
var simon = false;
var player = false;

// http://blog.modulus.io/nodejs-and-express-static-content
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	console.log('a user connected');

  	socket.on('simon message', function(msg){
    	io.emit('simon message', msg);
		console.log(msg);
  	});

  	socket.on('simon connected', function(msg) {
  		io.emit('simon connected', msg);
  		console.log(msg);
  		simon = true;
  	});

  	socket.on('player connected', function(msg) {
  		io.emit('player connected', msg);
  		console.log(msg);
  		player = true;
  	});

  	socket.on('round passed', function(msg){
  		io.emit('round passed', msg);
  		console.log(msg);
  	});
});

// // sending to sender-client only
//  socket.emit('message', "this is a test");

//  // sending to all clients, include sender
//  io.emit('message', "this is a test");

//  // sending to all clients except sender
//  socket.broadcast.emit('message', "this is a test");

//  // sending to all clients in 'game' room(channel) except sender
//  socket.broadcast.to('game').emit('message', 'nice game');

//  // sending to all clients in 'game' room(channel), include sender
//  io.in('game').emit('message', 'cool game');

//  // sending to sender client, only if they are in 'game' room(channel)
//  socket.to('game').emit('message', 'enjoy the game');

//  // sending to all clients in namespace 'myNamespace', include sender
//  io.of('myNamespace').emit('message', 'gg');

//  // sending to individual socketid
//  socket.broadcast.to(socketid).emit('message', 'for your eyes only');