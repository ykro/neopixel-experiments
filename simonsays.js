//new game luego de perder no sale
//multiple blinks no salen
var five     = require("johnny-five"),
    pixel    = require("../node-pixel/lib/pixel.js");

var START = 0;
var NEWGAME = 1;
var SELECTING = 2;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var strip;
var boardSize = 4;
var timesPlayed = 0;
var sequenceSize = 2;
var playsByLevel = 2;
var currentState = START;
var currentBoardPos = 0;
var numberOfPixels = 24;
var maxSequenceSize = numberOfPixels/2;
var colors = ["blue","green","red","yellow","teal"];

var board = [];
var intervalArrayIds = [];
var sequence = Array.new;
var userInputSequence = Array.new;

var j5board = new five.Board();

j5board.on("ready", function() {
  var button = new five.Button(2);
  var joystick = new five.Joystick({
    pins: ["A0", "A1"]
  });

  strip = new pixel.Strip({
    data: 6,
    length: numberOfPixels,
    board: this
  });

  newGame();


blink(0, 1, 500);  
blink(1, 1, 750);  

  button.on("up", function() { 
    if (currentState == START) {
      gameStep();      
      currentState = SELECTING;      
    } else if (currentState == NEWGAME) {
      board = [];
      newGame();
    } else if (currentState == SELECTING) {      
  	  if (intervalArrayIds.length > 0) {
  		clearInterval(intervalArrayIds[0]['intervalId']);
		lightUp(intervalArrayIds[0]['index']);  
		intervalArrayIds.splice(0,1);
  	  }    	
      userInputSequence.push(currentBoardPos);
      var result = checkInput();

      if (sequence.length == userInputSequence.length) {
      	if (result) {
      	  timesPlayed++;
      	  if (timesPlayed > playsByLevel) {
      	  	increaseLevel();
      	  	timesPlayed = 0;
      	  }
      	  gameStep();
      	} else {
      	  lost();
      	  currentState = NEWGAME;
      	}
      }
    }    
  });   

  joystick.on("axismove", function(err, timestamp) {
  	var direction = -1;;
  	var previousBoardPos = currentBoardPos;
  	if (this.fixed.y > 0.52) {
  	  direction = DOWN;
  	} else if (this.fixed.y < 0.48) {
	  direction = UP;
  	}

  	if (this.fixed.x > 0.52) {
	  direction = RIGHT;
  	} else if (this.fixed.x < 0.48) {
      direction = LEFT;
  	}  	
  	
  	if (currentBoardPos < boardSize/2) {
  	  if (currentBoardPos%2 == 0) {  	  	
  	    if (direction == DOWN) {
  	  	  currentBoardPos++;
  	    } else if (direction == LEFT) {  	      
  	  	  currentBoardPos--;
  	  	  if (currentBoardPos < 0) {
  	  	  	currentBoardPos = boardSize - 1;
  	  	  }
  	    }
  	  } else {
  	    if (direction == UP) {
  	  	  currentBoardPos--;
  	    } else if (direction == LEFT) {
  	  	  currentBoardPos++;
  	    }  	  	
  	  }

  	} else {
  	  if (currentBoardPos%2 == 0) {
  	    if (direction == UP) {
  	  	  currentBoardPos++;
  	    } else if (direction == RIGHT) {
  	  	  currentBoardPos--;
  	    }    	  	
  	  } else {
  	    if (direction == DOWN) {
  	  	  currentBoardPos--;
  	    } else if (direction == RIGHT) {
  	  	  currentBoardPos++;
  	  	  if (currentBoardPos > boardSize-1) {
			currentBoardPos = 0;
		  }  	  	  
  	    }	  	
  	  }  		
  	}

  	if (direction != -1) {
  	  if (intervalArrayIds.length > 0) {
  		clearInterval(intervalArrayIds[0]['intervalId']);
		lightUp(intervalArrayIds[0]['index']);  
		intervalArrayIds.splice(0,1);
  	  }
  	  blink(currentBoardPos,-1,125);
  	}
  });
});  

function newGame() {
  for (i = 0; i < boardSize; i++) {
    insertNewColor();
  }

  lightUpBoard();
}

function gameStep() {
  sequence = [];
  userInputSequence = [];
  for (i = 0; i < sequenceSize; i++) {
  	var boardElement = Math.round(Math.random() * boardSize);
  	sequence.push(boardElement);
  	
  }

  blink(boardElement, 1, 500);
  lightUp(boardElement);
}

function checkInput() {
  var result = true;
  console.log(userInputSequence.length + " " + userInputSequence[0] + " " + sequence[0]);
  for (i = 0; i < userInputSequence.length; i++) {  	
  	result = result && (userInputSequence[i] == sequence[i]);
  }
  return result;	
}

function lightUpBoard() {
  var currentSegment = 0;
  var intervalId = setInterval(function(){
  	if (currentSegment == boardSize) {
     clearInterval(intervalId);
  	} else {
  	  lightUp(currentSegment++);		
  	}
  }, 50);  
}

function lightUp(boardIndex) {
  color = board[boardIndex];
  var segmentSize = Math.floor(numberOfPixels / boardSize);

  for (var i = 0; i < segmentSize; i++) {
    strip.pixel(boardIndex*segmentSize + i).color(color);
  } 
  strip.show();
}

function lightDown(boardIndex) {
  color = "#000000";
  var segmentSize = Math.floor(numberOfPixels / boardSize);

  for (var i = 0; i < segmentSize; i++) {
    strip.pixel(boardIndex*segmentSize + i).color(color);
  } 
  strip.show();
}

function blink(index, times, timeout) {
  times *= 2;
  var blinkCounter = 0;	
  
  var blinkIntervalId = setInterval(function(){  	
  	if (blinkCounter == times) {  	  
      lightUp(index);
      clearInterval(blinkIntervalId);      
  	} else {
  	  if (blinkCounter++%2 == 0) {
  	    lightUp(index);
  	  } else {
  	  	lightDown(index);
  	  }
  	}
  }, timeout);
  intervalArrayIds.push({'intervalId': blinkIntervalId, 'index': index});
}

function increaseLevel() {
  sequenceSize++;
  if (boardSize < numberOfPixels) {
    if (sequenceSize == maxSequenceSize) {
  	  boardSize++;
  	  sequenceSize /= 2;
  	  insertNewColor();  
  	  lightUpBoard();	
    }  
  }
}

function lost(){
  if (intervalArrayIds.length > 0) {
    clearInterval(intervalArrayIds[0]['intervalId']);
    lightUp(intervalArrayIds[0]['index']);  
    intervalArrayIds.splice(0,1);
  }

  for (i = 0; i < boardSize; i++) {
    board[i] = "red";
  }
  lightUpBoard();
}

function insertNewColor() {
  board[board.length] = getRandomColor();
}

function getRandomColor() {
	var index = Math.round(Math.random()*(colors.length-1));

	var color = colors[index];
	colors.splice(index, 1);
/*
    var color = "rgb(" + Math.round(Math.random()*150) + "," + 
                     Math.round(Math.random()*150) + "," + 
                     Math.round(Math.random()*150) + ")";	
*/                     
	return color;
}