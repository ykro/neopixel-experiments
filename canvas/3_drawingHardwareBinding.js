var io = require('socket.io').listen(3000);
var five = require("johnny-five");
var pixel = require("../../node-pixel/lib/pixel.js");


var matrixRows = 8;
var matrixColumns = 32;
var numberOfPixels = matrixRows * matrixColumns;

var multiplier = 20;
var color = "#000";
var board = new five.Board();

board.on("ready", function() {
  var strip = new pixel.Strip({
    data: 6,
    length: numberOfPixels,
    board: this
  });

  io.on('connection', function (socket) {
    console.log('client connected ' + socket);
    socket.on('clear', function () {
      for (var i = 0; i < numberOfPixels; i++){
        strip.pixel(i).color('#000');        
      }  
      strip.show();     
    });


    socket.on('color', function (colorData) {
      var r = Math.round(colorData['r']);
      var g = Math.round(colorData['g']);
      var b = Math.round(colorData['b']);
      color = ['rgb(',r,',',g,',',b,')'].join('');
    });    

    socket.on('canvasData', function (canvasData) {
      var x = Math.round(canvasData['x'] / multiplier);
      var y = Math.round(canvasData['y'] / multiplier);
      var pos = (x * matrixRows) + y;
          /* fix matrix indexed in a different way */
      if (x%2 != 0) {            
        pos = (2*x*matrixRows)+(matrixRows-1)-pos;            
      }      

      if (pos < 256) {
        strip.pixel(pos).color(color);
        strip.show();      
      }
    });
  }); 
});
