let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 20;
let mCount = 50;
let movePoints, oldPoints;
let movePointsB, oldPointsB;

function preload() {
  font = loadFont("36DaysOfType.otf");
  img = loadImage("assets/Spot.png");
}

function setup() {
  count = 75;
  mCount = 25;
  createCanvas(900, 900);
  fSize = 900;
  textFont(font);
  textSize(fSize);
  msg = "p";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.15 , // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });
  console.log(pts); // { x, y, path angle }

  noStroke();
  background(0);

  largest = -10000;
  largesty = -10000;
  smallest = 10000;
  smallesty = 10000;

  oldPoints = [];
  movePoints = [];
  oldPointsB = [];
  movePointsB = [];

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
    oldPoints.push({
      x:"" + pts[i].x,
      y:"" + pts[i].y
    });
    movePoints.push({
      x:"" + (pts[i].x + random(-50,50)),
      y:"" + (pts[i].y + random(-50,50))
    });
    oldPointsB.push({
      x:"" + pts[i].x,
      y:"" + pts[i].y
    });
    movePointsB.push({
      x:"" + (pts[i].x + random(-70,70)),
      y:"" + (pts[i].y + random(-70,70))
    });
  }

  letterWidth = largest - smallest;
  letterHeight = largesty - smallesty;
 
}

function draw() {
  background(0,10);
  
  stroke(155,20);
  strokeWeight(4);


  for (let i = 0; i < movePointsB.length; i++) {
    var x = lerp(parseFloat(oldPointsB[i].x), parseFloat(movePointsB[i].x), easeInOutQuad(mCount/100));
    var y = lerp(parseFloat(oldPointsB[i].y), parseFloat(movePointsB[i].y), easeInOutQuad(mCount/100));
    point(450 + parseFloat(x) - smallest - letterWidth / 2, 450 + (parseFloat(y) - smallesty - letterHeight / 2));
  }

  stroke(255, 50);
  strokeWeight(easeInOutQuad(count/100)*10);

  for (let i = 0; i < movePoints.length; i++) {
    var x = lerp(parseFloat(oldPoints[i].x), parseFloat(movePoints[i].x), easeInOutQuad(count/100));
    var y = lerp(parseFloat(oldPoints[i].y), parseFloat(movePoints[i].y), easeInOutQuad(count/100));
    point(450 + parseFloat(x) - smallest - letterWidth / 2, 450 + (parseFloat(y) - smallesty - letterHeight / 2));
  }

  if (count == 100){
    for (let i = 0; i < pts.length; i++) {
      oldPoints[i].x = movePoints[i].x;
      oldPoints[i].y = movePoints[i].y;

      movePoints[i].x = pts[i].x + random(-50,50);
      movePoints[i].y = pts[i].y + random(-50,50);
    }
    count=0;
  }
  if (mCount == 100){
    for (let i = 0; i < pts.length; i++) {
      oldPointsB[i].x = movePointsB[i].x;
      oldPointsB[i].y = movePointsB[i].y;

      movePointsB[i].x = pts[i].x + random(-70,70);
      movePointsB[i].y = pts[i].y + random(-70,70);
    }
    mCount=0;
  }

  count++;
  mCount++;
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}