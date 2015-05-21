var socket;
var r, g, b;
var slider, sliderValue;

function setup() {
  createCanvas(520, 400);
  slider = createSlider(0, 60, 30);
  slider.position(10,450);
  
  r = random(255);
  g = random(255);
  b = random(255);  
  
  socket = io('http://localhost:3000');  
  socket.emit('color', { r : r, g : g, b : b }); 
}

function draw() {
  background(100);  
  strokeWeight(2);
  stroke(r,g,b);
  fill(r,g,b,100);
  ellipse(250,200,200,200);
  if (sliderValue != slider.value()) {
    sliderValue = slider.value();
    socket.emit('color', { r : r, g : g, b : b, 
                           slider: slider.value() });     
  }
}

function mousePressed() {
  var d = dist(mouseX, mouseY, 250, 200);
  if (d < 100) {
    r = random(255);
    g = random(255);
    b = random(255);
    socket.emit('color', { r : r, g : g, b : b, 
                           slider: slider.value() }); 
  } 
}