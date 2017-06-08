//we need to create the following variables 
//userGuess
//opponentGuess
//wins
//losses
//ties
//a boolean to determine whether the other player has made a guess
//what info do we need to store?
//both player's chat comments
//we need places to display...
//player's chat comments 
//wins
//losses 
//ties 
//opponent's guess 

  // Initialize Firebase

//firebase presence variables
//boolean to see if is connected 


//variables for wins, losses, userGuess, and opponentGuess
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCbeOFGFsBjQq-3I6CWCXtZGPufjq0fl04",
    authDomain: "rock-paper-scissors-mp.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-mp.firebaseio.com",
    projectId: "rock-paper-scissors-mp",
    storageBucket: "rock-paper-scissors-mp.appspot.com",
    messagingSenderId: "351528860085"
  };
  
  firebase.initializeApp(config);

var database = firebase.database();
var connectionsRef = database.ref("/connections");
// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
// When the client's connection state changes...
connectedRef.on("value", function(snap) {
  // If they are connected...on("value") gets updated when the page loads and whenever the data gets updated
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});
// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {
  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $(".connected-players").html(snap.numChildren());
});

window.onload = function() {
	$(".start").on("click", game.start);
	$(".play").on("click", game.play);
	$(".reset").on("click", game.reset);
	$(".button-chat").on("click", game.chat);
	database.ref().set({});

}

connectedRef.on("value", function(snap) {
  // If they are connected...on("value") gets updated when the page loads and whenever the data gets updated
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  } 
});

var user1Guess;
var user2Guess;
var user1wins = 0;
var user1losses = 0;
var user2wins = 0;
var user2losses = 0;
var user1Name;
var user2Name;
var turn;
var playerNumber = 0;


// At the page load and subsequent value changes, get a snapshot of the local data.
// This function allows you to update your page in real-time when the values within the firebase node bidderData changes



var game = {

	outcome: {
		player1Win: function() {
			console.log("Player1 win?")
			user1wins++; 
			user2losses++;
		    var winner = "player1";
			database.ref("/player1").update({
		      player1wins: user1wins,
		      winner: winner,
		    });
		    database.ref("/player2").update({
		      player2losses: user2losses,
		      winner: winner, 
		    });
		},

		player2Win: function() {
			console.log("Player 2 win?");
			user2wins++;
			user1losses++;
			var winner = "player2";
			database.ref("/player1").update({
		      	player1losses: user1losses,
		      	winner: winner,

		    });
		    database.ref("/player2").update({
		      	player2wins: user2wins,
		      	winner: winner,

		    });
		},

		tie: function() {
			var tieMessage = "You Tied!";
			database.ref().update({
		      	gameMessage: tieMessage,
		    });
		}
	},

	chat: function(){
		var chat = $("#chat-input").val().trim();
		database.ref("/chat").push({
	        chat : chat, 
      	})
	},

	start: function(){
		console.log("start");
			if (playerNumber < 1) {
				
				user1Name = prompt("What is your name player one?");
				playerNumber = 1;
				var gameMessage = "Waiting for Player Two!";
				database.ref("/player1").update({
			    	player1name: user1Name,
			 	});
			 	database.ref().update({
			 		gameMessage: gameMessage,
			    	playerNumber: playerNumber, 
			 	});
			 	$(".play").addClass("player1");
			 	$(".start").addClass("player1");

			} else if (playerNumber === 1) {
				if ($(this).hasClass("player1")) {
					return;
				} else {
					playerNumber = 2;
					user2Name = prompt("What is your name player two?");
					turn = "player1";
					var gameMessage = "Okay, time to play!"
					database.ref("/player2").update({
				    	player2name: user2Name,
				    	turn: turn,
				    	gameMessage: gameMessage,
				 	});
				 	database.ref("/player1").update({
				    	turn: turn,
				    	gameMessage: gameMessage,
				 	});
				 	database.ref().update({
				    	playerNumber: playerNumber,
				 	});
					$(".play").addClass("player2");
			 		$(".start").addClass("player2");
				}
			} else {
				return;
			}
		},		
	

	play: function() {

		if (turn === "player1") {
			if ($(this).hasClass("player1")) {

				user1Guess = $(this).text()
				console.log(user1Guess)
				turn = "player2";
				database.ref("/player1").update({
				   player1guess: user1Guess,
				   turn: turn,
				});
				database.ref("/player2").update({
				   turn: turn,
				});
			} else {
				return;
			}
		}

		else if ($(this).hasClass("player2")){
			user2Guess = $(this).text()
			turn = "player1";
			database.ref("/player2").update({
			   player2guess: user2Guess,
			   turn: turn,
			});
			database.ref("/player1").update({
				turn: turn,
			})
			console.log(user2Guess);

			if (user1Guess === "Rock" && user2Guess === "Paper") {
				game.outcome.player2Win();
			}

			else if (user1Guess === "Rock" && user2Guess === "Scissors") {
				game.outcome.player1Win();
			}

			else if (user1Guess === "Paper" && user2Guess === "Rock") {
				game.outcome.player1Win();
			} 

			else if (user1Guess === "Paper" && user2Guess === "Scissors") {
				game.outcome.player2Win();
			}
			else if (user1Guess === "Scissors" && user2Guess === "Rock") {
				game.outcome.player2Win();
			}

			else if (user1Guess === "Scissors" && user2Guess === "Paper") {
				game.outcome.player1Win();
			}
			else {
				game.outcome.tie();
			}

			
		} else {
			console.log("didn't play");
			return;
		}
	},

	reset: function () {
		database.ref().set({});
		user1Guess;
		user2Guess;
		user1wins = 0;
		user1losses = 0;
		user2wins = 0;
		user2losses = 0;
		user1Name;
		user2Name;
		turn;
		playerNumber = 0;
	}
}

database.ref("/player1").on("value", function(snapshot) {
     //Set the local variables for user guesses equal to the stored values in firebase.
	if (snapshot.child("turn").exists()) {
		turn = snapshot.val().turn
			if (turn === "player1")	{	
				$(".turn-message").html("Turn: " + snapshot.val().player1name);
			}
	}

	if (snapshot.child("winner").exists()) {
		winner = snapshot.val().winner
			if (winner === "player1")	{	
				$(".win-message").html("Winner: " + snapshot.val().player1name);
			}
	}

	if (snapshot.child("gameMessage").exists()) {
		$(".game-message").html(snapshot.val().gameMessage);
	}

	if (snapshot.child("player1guess").exists()) {
	  	user1Guess = snapshot.val().player1guess; 
	}

	if (snapshot.child("player1wins").exists()) { 
		var wins = snapshot.val().player1wins;
  		$(".player-1-wins").html(player1name + "'s wins:" + user1wins) 
	} 

	if (snapshot.child("player1losses").exists()) { 
  		var losses = snapshot.val().player1losses;
  		$(".player-1-losses").html(player1name + "'s losses:" + user1losses) 
	}

	if (snapshot.child("player1Name").exists()) {
	    user1Name = snapshot.val().player1name; 
	}       

});

database.ref("/player2").on("value", function(snapshot) {
	if (snapshot.child("turn").exists()) {
		turn = snapshot.val().turn
			if (turn === "player2")	{	
				$(".turn-message").html("Turn: " + snapshot.val().player2name);
			}
	}

	if (snapshot.child("winner").exists()) {
		winner = snapshot.val().winner
			if (winner === "player2")	{	
				$(".win-message").html("Winner: " + snapshot.val().player2name);
			}
	}

	if (snapshot.child("gameMessage").exists()) {
		$(".game-message").html(snapshot.val().gameMessage);
	}


	if (snapshot.child("player2guess").exists()) {
	  	user2Guess = snapshot.val().player2guess; 

	}

	if (snapshot.child("player2wins").exists()) { 
		var wins = snapshot.val().player2wins;
  		$(".player-2-wins").html(player2name + "'s wins:" + user2wins) 

	} 

	if (snapshot.child("player2losses").exists()) { 
  		var losses = snapshot.val().player2losses;
  		$(".player-2-losses").html(player2name + "'s losses:" + user2losses) 

	}

	if (snapshot.child("player2Name").exists()) {
	    user2Name = snapshot.val().player2Name; 
	}       

});

database.ref().on("value", function(snapshot) {
	
	if (snapshot.child("playerNumber").exists()) {
		playerNumber = snapshot.val().playerNumber;
	}
});

database.ref("/chat").on('child_added', function(childSnapshot){
      console.log(childSnapshot.val());
      var newRow = $('<tr>');
      var newName = $('<p class = "chat-p">').text(childSnapshot.val().chat).appendTo(newRow);
      
  
  newRow.appendTo($('#new-chat'));
  
});


