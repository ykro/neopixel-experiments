var socket;

function setup() {
  createCanvas(1280, 320);
  socket = io('http://localhost:3000');   
}

function draw() {
  if (mouseIsPressed) {
  	var color = "#0000F0";
    fill(color);
    ellipse(mouseX, mouseY, 20, 20);
    socket.emit('canvasData', { color : color, x : mouseX, y : mouseY });
  }  
}