var five = require("johnny-five");
var board = new five.Board();
var pixel = require("../node-pixel/lib/pixel.js");
var numberOfPixels = 60;

board.on("ready", function() {
  var strip = new pixel.Strip({
    data: 6,
    length: numberOfPixels,
    board: this
  });

  var sensor = new five.Sensor({
    pin: "A0",
    freq: 200
  });

  sensor.scale([0, Math.round(numberOfPixels*5)]).on("data", function() {
    var pixelsToLight = Math.round(this.value);
    console.log( "Sound Level:", pixelsToLight);
    for (var i = 0; i < numberOfPixels; i+=2) {
      var color = "#000000"
      if (i < pixelsToLight) {
        rgb = wheel(map(i,0,numberOfPixels-1,50,180));
        color = "rgb(" + Math.round(rgb[0]) + "," + 
                         Math.round(rgb[1]) + "," + 
                         Math.round(rgb[2]) + ")";
      }
      strip.pixel(i).color(color);
      strip.pixel(i+1).color(color);      
    }
    strip.show();
  });
});

function map( x,  in_min,  in_max,  out_min,  out_max){
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function wheel(WheelPos) {
  if(WheelPos < 85) {
   return [WheelPos * 3, 255 - WheelPos * 3, 0];
  } else if(WheelPos < 170) {
   WheelPos -= 85;
   return [255 - WheelPos * 3, 0, WheelPos * 3];
  } else {
   WheelPos -= 170;
   return [0, WheelPos * 3, 255 - WheelPos * 3];
  }
}