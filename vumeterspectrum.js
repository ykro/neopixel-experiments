var five = require("johnny-five");
var FFT = require("fft");
var pixel = require("../node-pixel/lib/pixel.js");

var matrixRows = 8;
var matrixColumns = 32;

var samples = 256;
var sampleCounter = 0;
var sampleData = new Array(samples);

var fft = new FFT.complex(samples, false);
var fftResult = new Array(samples*2);

var numberOfPixels = matrixRows*matrixColumns;
var board = new five.Board();
var arrayToShow = new Array(matrixColumns);

board.on("ready", function() {
  var strip = new pixel.Strip({
    data: 6,
    length: numberOfPixels,
    board: this
  });

  var sensor = new five.Sensor({
    pin: "A0",
    freq: 1
  });
       
  sensor.on("data", function() {
    if (sampleCounter < samples) {
      sampleData[sampleCounter++] = this.value;
    } else {
      sampleCounter = 0;
      fft.simple(fftResult, sampleData, 'real')      
      fftResult.shift(); //first nib is DC

      for (var i = 0; i < matrixColumns; i++) {
        var avgGroupSize = Math.round(samples/matrixColumns);

        var avgValue = fftResult[i];
        for (var j = 0; j < avgGroupSize; j++) {
          avgValue += fftResult[(i*avgGroupSize)+j];
        }        

        arrayToShow[i] = Math.abs(avgValue/avgGroupSize);
        arrayToShow[i] = Math.round(arrayToShow[i] % matrixRows);
      }

      console.log(arrayToShow);

 for (var i = 0; i < matrixColumns; i++) {
        for (var j = 0; j < matrixRows; j++) {

          color = "#000000";
          if (j < arrayToShow[i]) {
            /*
            rgb = wheel(Math.random()*i*matrixRows);

            
            //rgb = wheel(map(i,0,matrixRows-1,10,100));
            
            rgb[0] = Math.abs(Math.round(rgb[0])) % 255;
            rgb[1] = Math.abs(Math.round(rgb[1])) % 255;
            rgb[2] = Math.abs(Math.round(rgb[2])) % 255;
            
            color = "rgb(" + Math.round(rgb[0]) + "," + 
                             Math.round(rgb[1]) + "," + 
                             Math.round(rgb[2]) + ")";
            */
            color = "blue";
          }          
          
          var pos = (i * matrixRows) + j;

          /* fix matrix indexed in a different way */
          if (i%2 == 0) {            
            pos = (2*i*matrixRows)+(matrixRows-1)-pos;            
          }

          strip.pixel(pos).color(color);
        }
      }
      
      strip.show();  
    }
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