// Socket Simon
// By Nick Martini 
// and Dan Hart

// Debug 1, 0 for no.
var debug = 0;

var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var app = express();

// http://blog.modulus.io/nodejs-and-express-static-content
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	//console.log('a user connected');
 //  socket.on('simon message', function(msg){
 //    io.emit('simon message', msg);
	// console.log(msg);
 //  });
});;

app.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});