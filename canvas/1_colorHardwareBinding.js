var io = require('socket.io').listen(3000);
var five = require("johnny-five");
var pixel = require("../../node-pixel/lib/pixel.js");

var numberOfPixels = 60;
var board = new five.Board();

board.on("ready", function() {
  var strip = new pixel.Strip({
    data: 6,
    length: numberOfPixels,
    board: this
  });

  io.on('connection', function (socket) {
    console.log('client connected ' + socket);
    socket.on('color', function (colorData) {
      var r = Math.round(colorData['r']);
      var g = Math.round(colorData['g']);
      var b = Math.round(colorData['b']);
      var color = ['rgb(',r,',',g,',',b,')'].join('');
      for (var i = 0; i < numberOfPixels; i++){
        strip.pixel(i).color(color);        
      }
      strip.show();
    });
  }); 
});
