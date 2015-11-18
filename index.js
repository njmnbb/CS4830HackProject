// Socket Simon
// By Nick Martini 
// and Dan Hart

// Debug 1, 0 for no.
var debug = 0;

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

// This function is intended for use for the 'player'
// Pass the string that was received from 'Simon'
// here, and display lit tiles accordingly.
function displayPattern(seqString) {
	// Check if variable is a string.
	if ( typeof seqString != 'string' ) {
		if( debug == 1 ) {
			console.log(seqString);
		}
		return 0;
	} 
	else {
	    var i = 0;

	    // pass over each character in string.
	    for( i = 0; i < seqString.length; i++ ) {
	    	var character = seqString[i];
	    	switch(character) {
	    		case 1:
	    		// Change Color of Appropriate Div Here
	    		break;

	    		case 2:
	    		// Change Color of Appropriate Div Here
	    		break;

	    		case 3:
	    		// Change Color of Appropriate Div Here
	    		break;

	    		case 4:
	    		// Change Color of Appropriate Div Here
	    		break;

	    		default:
	    		// Some Stuff
	    		break;
	    	}
	    	if( debug == 1 ) {
	    		console.log(character);
	    	}
	    }
	    return 1;
	}
}
