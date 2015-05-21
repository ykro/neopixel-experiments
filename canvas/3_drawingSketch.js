var socket;
var r, g, b;

function setup() {
  createCanvas(640, 160);
  socket = io('http://localhost:3000');

  r = random(255);
  g = random(255);
  b = random(255);  
  
  redSlider = createSlider(0, 255, r);
  redSlider.position(650, 20);
  greenSlider = createSlider(0, 255, g);
  greenSlider.position(650, 50);
  blueSlider = createSlider(0, 255, b);
  blueSlider.position(650, 80);
  socket.emit('color', { r : r, g : g, b : b }); 

  button = createButton('clear');
  button.position(640, 120);
  button.mousePressed(clearCanvas);   
}

function clearCanvas() {
  socket.emit('clear');
}

function draw() {
  text("R", 630, 25);
  text("G", 630, 55);
  text("B", 630, 85);

  if (mouseIsPressed) {  	
    fill(r, g, b);
    ellipse(mouseX, mouseY, 10, 10);
    socket.emit('canvasData', {  x : mouseX, y : mouseY });
  }  

  r = redSlider.value();
  g = greenSlider.value();
  b = blueSlider.value();
  socket.emit('color', { r : r, g : g, b : b }); 
}