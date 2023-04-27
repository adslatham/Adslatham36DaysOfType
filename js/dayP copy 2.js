let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let mCount = 0;
let gCount = 0;

function preload() {
  font = loadFont("36DaysOfType.otf");
  img = loadImage("assets/Spot.png");
}

function setup() {
  count = 0;
  createCanvas(900, 900, WEBGL);
  fSize = 900;
  textFont(font);
  textSize(fSize);
  msg = "p";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.07 , // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });
  console.log(pts); // { x, y, path angle }

  noStroke();
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
    movePoints.push({
      x:"" + pts[i].x,
      y:"" + pts[i].y
    });
  }

  letterWidth = largest - smallest;
  letterHeight = largesty - smallesty;
 
}

var change = 1;
var hold = 0;

function draw() {
  background(0);
  rotateY(mCount);

  ambientLight(100);
  directionalLight(255, 255, 200, sin(frameCount / 30), 0, cos(frameCount / 30));

  var detailX = pts.length-22;
  var detailY = 2;

  let myGeometry = new p5.Geometry(detailX, detailY, function(){
    for (let j = 0; j <= detailY; j++) {
      for (let i = 0; i <= detailX; i++) {        
        this.vertices.push(new p5.Vector((parseFloat(pts[i].x) - smallest - letterWidth / 2), (parseFloat(movePoints[i].y) - smallesty - letterHeight / 2) , sin((i/5)+gCount)*60 + (i/1)+(j*10)));
      }
    }
    this.computeNormals();
    this.computeFaces();
  });

  model(myGeometry);

  count+=change;
  if (count > pts.length-22){
    if (hold < 100){
      hold++;
      change = 0;
    }else{
      change = -1;
      hold = -1;
    }
  }
  if (count == 0){
    change = 1;
  }
  gCount+=0.1;
  mCount+=0.02;
}

function rotatepoint(cx, cy, radius, angle) {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * radius + sin * radius + cx,
    ny = cos * radius - sin * radius + cy;
  return [nx, ny];
}
