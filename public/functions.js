var socket = io();
var role;
var round = 4; // Using 4 for testing. Should be 0 normally
var numPlayers = 0;

// Function for 'start' buttons
	function startGame(sentRole) {
	//alert('You started the game as a ' + sentRole);
	role = sentRole;

	// Clear Header and game frame
	clearDiv('simon');
	clearDiv('player');
	clearDiv('header');

	// populate with gameData
	loadGameAs(role, 'player', 'simon', 'header');
	// while(1) {
		playRound(role, 'player', 'simon', 'header');
	// }
	}

	// Function to get current role of player.
	function currentRole() {
		if( role != undefined )
			// console.log(role);
			return role;
	}

	// Clear a Div
	function clearDiv(elementID) {
	document.getElementsByClassName(elementID)[0].innerHTML = "";
}

// Game functions
function loadGameAs(role, leftDiv, rightDiv, headerDiv) {
	var counter = 0;
	if( role == 'player') {
		// Emitting a message that the player has connected
		socket.emit('player connected', 'a player has connected');
		document.getElementsByClassName(headerDiv)[0].innerHTML = '<p class = "header-text">Waiting for Simon to connect...</p>';

		//Does not load game board until simon has also connected
		socket.on('simon connected', function(){
			if(counter < 1) {
				socket.emit('player connected', 'a player has connected');
				document.getElementsByClassName(headerDiv)[0].innerHTML = '<p class = "header-text">Waiting for Simon to make a pattern</p>';
				document.getElementsByClassName(leftDiv)[0].innerHTML = '<p class = "header-text">You</p>';
				document.getElementsByClassName(rightDiv)[0].innerHTML = '<p class = "header-text">Simon</p><input type = "image" value = "0" class = "quadrant-active" src = "images/simon/green.png"></input><input type = "image" value = "1" class = "quadrant-active" src = "images/simon/red.png"></input><input type = "image" value = "2" class = "quadrant-active" src = "images/simon/yellow.png"></input><input type = "image" value = "3" class = "quadrant-active" src = "images/simon/blue.png"></input>';
				counter++;
			}
		});
	}
	else if( role == 'simon' ) {
		// Emitting a message that simon has connected
		socket.emit('simon connected', 'simon has connected');
		document.getElementsByClassName(headerDiv)[0].innerHTML = '<p class = "header-text">Waiting for Player to connect...</p>';

		//Does not load game board until player has also connected
		socket.on('player connected', function(){
			if(counter < 1) {
				socket.emit('simon connected', 'simon has connected');
				document.getElementsByClassName(headerDiv)[0].innerHTML = '<p class = "header-text">Create a pattern...</p>';
				document.getElementsByClassName(leftDiv)[0].innerHTML = '<p class = "header-text">You</p><input type = "image" value = "0" class = "quadrant-active" src = "images/simon/green.png"></input><input type = "image" value = "1" class = "quadrant-active" src = "images/simon/red.png"></input><input type = "image" value = "2" class = "quadrant-active" src = "images/simon/yellow.png"></input><input type = "image" value = "3" class = "quadrant-active" src = "images/simon/blue.png"></input>';
				document.getElementsByClassName(rightDiv)[0].innerHTML = '<p class = "header-text">Player</p>';
				counter++;
			}
		});
	}
	else {
		// No
	}
}

function playRound(role, leftDiv, rightDiv, headerDiv) {
	if (role == "simon") {
		var simonArr = [];
		$(document).on("click", ".quadrant-active", function() {

			// Appends the value of the clicked quadrant to
			// an array. Array can only be as long as the current
			// round (i.e. on round 3, array can only have 3 values)
			if(simonArr.length >= round) {
				return 0;
			}
			// Otherwise, add Simon's entires to array and
			// emit array through sockets
			else {
				simonArr.push($(this).attr('value'));
				console.log(simonArr);
				console.log(round);

				// If the array is "full" (equal to round), emit array to player
				if(simonArr.length == round) {

					// Change header
					clearDiv(headerDiv);
					document.getElementsByClassName(headerDiv)[0].innerHTML = '<p class = "header-text">Pattern Sent!</p>';

					// left div
					clearDiv(leftDiv);
					document.getElementsByClassName(leftDiv)[0].innerHTML = '<p class = "header-text">You</p>';

					// Right Div
					clearDiv(rightDiv);
					document.getElementsByClassName(rightDiv)[0].innerHTML = '<p class = "header-text">Player</p><img src="images/simon/green.png" class = "quadrant"><img src="images/simon/red.png" class = "quadrant"><img src="images/simon/yellow.png" class = "quadrant"><img src="images/simon/blue.png" class = "quadrant">';
					socket.emit('simon message', simonArr);

				}
			}
		});
	}
	else if(role == "player") {
		// Display pattern.
		socket.on('simon message', function(msg) {
			document.getElementsByClassName(headerDiv)[0].innerHTML = '<p class = "header-text">Watch Simon Closely!</p>';
								playback = 1;
			// Go through emitted array recursively and highlight the
			// appropriate quadrants in the view for the player
			var i = 0;
			function quadrantLoop() {

				//Timeout used to light up each quadrant every 1 second
				setTimeout(function(){

					//If the quadrant is highlighted, remove the highlight class
					if($('input.quadrant-active').hasClass('quadrant-highlight')) {
						$('input.quadrant-active').removeClass('quadrant-highlight');
					}
					console.log(i);

					//Adding highlight class to corresponding quadrant
					var quadrant = $(".quadrant-active[value = \"" + msg[i] + "\"]");
					quadrant.addClass('quadrant-highlight');

					//If the array is not finished, run function again
					i++;
					if (i < msg.length) {
						quadrantLoop();
					}

					//Else, remove the last highlight class and let player solve the pattern
					else {
						setTimeout(function() {
							$('input.quadrant-active').removeClass('quadrant-highlight');

							// Player now tries to solve Simon's pattern
							document.getElementsByClassName(headerDiv)[0].innerHTML = '<p class = "header-text">Try to match Simon!</p>';
							document.getElementsByClassName(leftDiv)[0].innerHTML = '<p class = "header-text">You</p><input type = "image" value = "0" class = "quadrant-active" src = "images/simon/green.png"></input><input type = "image" value = "1" class = "quadrant-active" src = "images/simon/red.png"></input><input type = "image" value = "2" class = "quadrant-active" src = "images/simon/yellow.png"></input><input type = "image" value = "3" class = "quadrant-active" src = "images/simon/blue.png"></input>';
							document.getElementsByClassName(rightDiv)[0].innerHTML = '<p class = "header-text">Simon</p>';
						}, 1000);		
					}
				}, 1000);
			}
			quadrantLoop();
		});
	}
}