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

// http://blog.modulus.io/nodejs-and-express-static-content
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	console.log('a user connected');
  	socket.on('simon message', function(msg){
    io.emit('simon message', msg);
	console.log(msg);
  });
});

