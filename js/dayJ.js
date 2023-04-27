let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;

function preload() {
  font = loadFont("36DaysOfType.otf");
  img = loadImage("assets/Spot.png");
}

function setup() {
  count = 0;
  createCanvas(900, 900);
  fSize = 900;
  textFont(font);
  textSize(fSize);
  msg = "j";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.2, // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });
  console.log(pts); // { x, y, path angle }

  stroke(255);
  background(0);

  largest = -10000;
  largesty = -10000;
  smallest = 10000;
  smallesty = 10000;

  movePoints = [];

  for (let i = 0; i < pts.length; i++) {
    if (pts[i].x > largest) {
      largest = pts[i].x;
    }
    if (pts[i].x < smallest) {
      smallest = pts[i].x;
    }
    if (pts[i].y > largesty) {
      largesty = pts[i].y;
    }
    if (pts[i].y < smallesty) {
      smallesty = pts[i].y;
    }
  }

  letterWidth = largest - smallest;
  letterHeight = largesty - smallesty;
}

function draw() {
  background(0,5);
  strokeWeight(2);
  fill(255);

  beginShape();
  for (var i = 0; i < pts.length; i++)
  {
    if (i > 0){
      if (abs(pts[i].x - pts[i-1].x) > 20){
        endShape();
        beginShape();
      }
    }
    var nx = (noise((pts[i].x/300)+count)-0.5)*600
    var ny = (noise((pts[i].y/300)+count)-0.5)*600
    vertex(450 + (parseFloat(pts[i].x) - smallest - letterWidth / 2) + nx, 450 + (parseFloat(pts[i].y) - smallesty - letterHeight / 2) + ny);
  }
  endShape();

  count += 0.008;

  if (count >= pts.length-1){
    count = 0;
  }
}

function rotatepoint(cx, cy, radius, angle) {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * radius + sin * radius + cx,
    ny = cos * radius - sin * radius + cy;
  return [nx, ny];
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}