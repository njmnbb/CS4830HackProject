// Socket Simon
// By Nick Martini and Dan Hart

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('pattern sequence', function(patten_sequence){
    io.emit('pattern sequence', pattern_sequence);
	console.log(pattern_sequence);
  });
});;

http.listen(3000, function(){
  console.log('listening on *:3000');
});
