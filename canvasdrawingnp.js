var io = require('socket.io').listen(3000);
var five = require("johnny-five");
var pixel = require("../node-pixel/lib/pixel.js");


var matrixRows = 8;
var matrixColumns = 32;
var numberOfPixels = matrixRows * matrixColumns;

var multiplier = 40;

var board = new five.Board();

board.on("ready", function() {
  var strip = new pixel.Strip({
    data: 6,
    length: numberOfPixels,
    board: this
  });

  io.on('connection', function (socket) {
    console.log('client connected ' + socket);
    socket.on('canvasData', function (canvasData) {
      var color = canvasData['color'];
      var x = Math.round(canvasData['x'] / multiplier);
      var y = Math.round(canvasData['y'] / multiplier);
      var pos = (x * matrixRows) + y;
          /* fix matrix indexed in a different way */
      if (x%2 != 0) {            
        pos = (2*x*matrixRows)+(matrixRows-1)-pos;            
      }      
      console.log(pos);
      if (pos < 256) {
        strip.pixel(pos).color(color);
        strip.show();      
      }
    });
  }); 
});
