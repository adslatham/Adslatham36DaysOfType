let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let boxes = [];
let movePoints = [];

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
  msg = "i";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.06 , // increase for more points
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
    movePoints.push({
      x:"" + pts[i].x,
      y:"" + pts[i].y
    });
  }

  letterWidth = largest - smallest;
  letterHeight = largesty - smallesty;
}

function draw() {
  background(0,2);
  strokeWeight(2);
  //stroke(255);
  for (var i = 0; i < movePoints.length; i++) {
    push();
    let vectorx = (noise(i)-0.5)*5 + sin(i) + (noise((count/10)+(i/10))-0.5)*10;
    let vectory = cos(i) * noise(parseFloat(movePoints[i].y)) + (noise(i)-0.5) + (noise((count/10)+(i/10))-0.5)*10;
    if (abs(parseFloat(movePoints[i].x) - pts[i].x) + abs(parseFloat(movePoints[i].y - pts[i].y)) > 510){
      movePoints[i].x = "" + pts[i].x;
      movePoints[i].y = "" + pts[i].y;
    }
    stroke(255 - ((abs(parseFloat(movePoints[i].x) - pts[i].x) + abs(parseFloat(movePoints[i].y - pts[i].y)))/2));
    strokeWeight(5);
    fill(noise(i / 10 + count / 80) * 150);
    point(450 + (parseFloat(movePoints[i].x) - smallest - letterWidth / 2), 450 + (parseFloat(movePoints[i].y) - smallesty - letterHeight / 2));

    movePoints[i].x = "" + (parseFloat(movePoints[i].x) + vectorx);
    movePoints[i].y = "" + (parseFloat(movePoints[i].y) + vectory);

    //line(450 + (p1[0] - smallest - letterWidth / 2), 450 + (p1[1] - smallesty - letterHeight / 2), 450 + (p2[0] - smallest - letterWidth / 2), 450 + (p2[1] - smallesty - letterHeight / 2));
    //point(450 + (p.x - smallest - letterWidth / 2), 450 + (p.y - smallesty - letterHeight / 2));
    pop();
  }

  fill(255,5);
  noStroke();
  for (var i = 0; i < pts.length; i++){
    if (i == 0){
      beginShape();
    }else if (abs(pts[i-1].y - pts[i].y) > 50){
      endShape();
      beginShape();
    }
    vertex(450 + (parseFloat(pts[i].x) - smallest - letterWidth / 2), 450 + (parseFloat(pts[i].y) - smallesty - letterHeight / 2));
  }
  endShape();
  fill(255);

  count += 0.1;
}

function rotatepoint(cx, cy, radius, angle) {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * radius + sin * radius + cx,
    ny = cos * radius - sin * radius + cy;
  return [nx, ny];
}
