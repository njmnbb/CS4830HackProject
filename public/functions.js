var socket = io();		// Connection to node server/Socket.io
var role;				// The role that the user has chosen
var round = 0;			// The round number that is being
var simonArr = [];		// Array of values that make up simon's sequence for the player

// First function that is run for this application
// Function for 'start' buttons
function startGame(sentRole) {
	role = sentRole;

	// Clear Header and game frame
	clearDiv('.simon');
	clearDiv('.player');
	clearDiv('.header');

	// Populate with gameData
	loadGameAs(role, '.player', '.simon', '.header');
}

// Function to get current role of player.
function currentRole() {
	if( role != undefined )
		return role;
}

// Function that clears a div of its content
function clearDiv(elementID) {
	$(elementID).html("");
}

// Loops through the array sent by Simon and displays each selected
// quadrant. The player then attempts to solve the pattern.
function quadrantLoop(msg, i, leftDiv, rightDiv, headerDiv) {

	// Timeout used to light up each quadrant every 1 second
	setTimeout(function(){

		// If the quadrant is highlighted, remove the highlight class
		if($('input.quadrant-active').hasClass('quadrant-highlight')) {
			$('input.quadrant-active').removeClass('quadrant-highlight');
		}

		// Adding highlight class to corresponding quadrant
		var quadrant = $(".quadrant-active[value = \"" + msg[i] + "\"]");
		quadrant.addClass('quadrant-highlight');

		// Adding to the counter variable
		// Used to parse through the 'msg' array
		i++;

		// If the array is not finished, run function again
		if (i < msg.length) {
			quadrantLoop(msg, i, leftDiv, rightDiv, headerDiv);
		}
		else {
			solve(msg, leftDiv, rightDiv, headerDiv);
		}
	}, 1000);
}

// A function that runs when the player recieves an array of values from simon
// The function determines if the player has chosen the correct sequence or not
// and reacts accordingly
function solve(msg, leftDiv, rightDiv, headerDiv) {
	setTimeout(function() {
		$('input.quadrant-active').removeClass('quadrant-highlight');

		// Player now tries to solve Simon's pattern
		var i = 0;
		var quadrant = $(".quadrant-active[value = \"" + msg[i] + "\"]");
		$(headerDiv).html('<p class = "header-text">Try to match Simon!</p>');
		$(leftDiv).html('<p class = "header-text">You</p><input type = "image" value = "0" class = "quadrant-active" src = "images/simon/green.png"></input><input type = "image" value = "1" class = "quadrant-active" src = "images/simon/red.png"></input><input type = "image" value = "2" class = "quadrant-active" src = "images/simon/yellow.png"></input><input type = "image" value = "3" class = "quadrant-active" src = "images/simon/blue.png"></input>');
		$(rightDiv).html('<p class = "header-text">Simon</p>');
		
		// If the selected quadrant matches the pattern, move to next number in array
		$(".quadrant-active").click(function() {

			// If the player selects the correct quadrant, add to counter
			// and check to see if they reached the end of the array
			if($(this).attr('value') == msg[i]) {

				// Move to next value in array
				i++;

				//If the player reached the end, emit a message saying the round is over
				if(i == msg.length) {
					socket.emit('round passed', 'a round has been passed');
				}		
			}

			// Otherwise, end the game and display a losing message
			else {
				// $(headerDiv).html('<p class = "header-text">You lose!</p><br><p class = "header-text">You made it round ' + round + '</p>');
				
				socket.emit('game over', 'the player has lost');
			}
		});
	}, 1000);	
}	

// Game functions
function loadGameAs(role, leftDiv, rightDiv, headerDiv) {
	var counter = 0;
	if( role == 'player') {
		// Emitting a message that the player has connected
		socket.emit('player connected', 'a player has connected');
		$(headerDiv).html('<p class = "header-text">Waiting for Simon to connect...</p>');

		//Does not load game board until simon has also connected
		socket.on('simon connected', function(){
			if(counter < 1) {

				// Emit message saying that a player has connected
				socket.emit('player connected', 'a player has connected');

				// Changing front-end to reflect that the user has chosen to be a player
				$(headerDiv).html('<p class = "header-text">Waiting for next pattern...</p>');
				$(leftDiv).html('<p class = "header-text">You</p>');
				$(rightDiv).html('<p class = "header-text">Simon</p><input type = "image" value = "0" class = "quadrant-active" src = "images/simon/green.png"></input><input type = "image" value = "1" class = "quadrant-active" src = "images/simon/red.png"></input><input type = "image" value = "2" class = "quadrant-active" src = "images/simon/yellow.png"></input><input type = "image" value = "3" class = "quadrant-active" src = "images/simon/blue.png"></input>');
				counter++;
				round++;
				playRound('player', '.player', '.simon', '.header', round);
			}
		});
	}
	else if( role == 'simon' ) {
		// Emitting a message that simon has connected
		socket.emit('simon connected', 'simon has connected');
		$(headerDiv).html('<p class = "header-text">Waiting for Player to connect...</p>');

		//Does not load game board until player has also connected
		socket.on('player connected', function(){
			if(counter < 1) {

				// Emit message saying that simon has connected
				socket.emit('simon connected', 'simon has connected');

				// Changing front-end to reflect that the user has chosen to be simon
				$(headerDiv).html('<p class = "header-text">Create a pattern...</p>');
				$(leftDiv).html('<p class = "header-text">You</p><input type = "image" value = "0" class = "quadrant-active" src = "images/simon/green.png"></input><input type = "image" value = "1" class = "quadrant-active" src = "images/simon/red.png"></input><input type = "image" value = "2" class = "quadrant-active" src = "images/simon/yellow.png"></input><input type = "image" value = "3" class = "quadrant-active" src = "images/simon/blue.png"></input>');
				$(rightDiv).html('<p class = "header-text">Player</p>');

				// Increment the round number and the counter before entering next round
				counter++;
				round++;

				// Enter next round
				playRound('simon', '.player', '.simon', '.header', round);
			}
		});
	}
}

function playRound(role, leftDiv, rightDiv, headerDiv, round) {

	// If the user selected simon as their role, set up
	// the board so they may start to create their pattern
	if (role == "simon") {
		$(document).on("click", ".quadrant-active", function() {

			// Appends the value of the clicked quadrant to
			// an array. Array can only be as long as the current
			// round (i.e. on round 3, array can only have 3 values)
			if(simonArr.length >= round) {
				return 0;
			}

			// Otherwise, if the pattern is complete, add Simon's
			// entries to the array and emit array through sockets
			else {

				// Add values to array to be sent
				simonArr.push($(this).attr('value'));

				// If the array is "full" (equal to round), emit array to player
				// and clear out the divs for next round
				if(simonArr.length == round) {

					// Change header
					clearDiv(headerDiv);
					$(headerDiv).html('<p class = "header-text">Pattern Sent!</p>');

					// left div
					clearDiv(leftDiv);
					$(leftDiv).html('<p class = "header-text">You</p>');

					// Right Div
					clearDiv(rightDiv);
					$(rightDiv).html('<p class = "header-text">Player</p><img src="images/simon/green.png" class = "quadrant"><img src="images/simon/red.png" class = "quadrant"><img src="images/simon/yellow.png" class = "quadrant"><img src="images/simon/blue.png" class = "quadrant">');
					
					// Emit message saying the array is complete
					socket.emit('simon message', simonArr);
				}
			}
		});
	}

	// If the user selected the player as their role,
	// recieve the array from Simon and attempt to solve it
	else if(role == "player") {

		// Only perform this function if a message is recieved saying simon has finished their pattern
		socket.on('simon message', function(msg) {
			$(headerDiv).html('<p class = "header-text">Watch Simon Closely!</p>');

			// Go through emitted array recursively and highlight the
			// appropriate quadrants in the view for the player
			quadrantLoop(msg, 0, leftDiv, rightDiv, headerDiv);	
		});
	}
}

// Function that ends the game for both users
// Displays the score of the player and appropriate
// messages for each role
function endGame(role, round, headerDiv, leftDiv, rightDiv) {
	// Clearing out game board
	$("#game").addClass("hidden");

	// Display score and appropriate ending message for each type of user
	if(role == "simon") {
		$(headerDiv).html('<p class = "header-text">The player has lost.<br>The player has made it to round ' + round + '</p>');
	}
	else if(role == "player") {
		$(headerDiv).html('<p class = "header-text">You have lost.<br>You made it to round ' + round + '</p>');
	}
}

// Listen for a message saying the round is over to load a new round
socket.on('round passed', function(){
	loadGameAs(role, '.player', '.simon', '.header');
})

//Listen for a message saying that the game is over to game over screen
socket.on('game over', function(){
	endGame(role, round, '.header', '.left', '.right');
})