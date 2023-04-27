let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 20;
let mCount = 50;
let movePoints, oldPoints;

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
  msg = "q";
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

  for (let a = 0; a < pts.length; a++){
    var tempArray = [];
    for (let i = 0; i < pts.length; i++) {
      tempArray.push({
        x:"" + (pts[i].x + (noise(i/50,mCount+a)*(300/(a+1)))-(150/(a+1))),
        y:"" + (pts[i].y + (noise(i/50,mCount)*(300/(a+1)))-(150/(a+1)))
      });
    }
    movePoints.push($.parseJSON(JSON.stringify(tempArray)));
    oldPoints.push($.parseJSON(JSON.stringify(tempArray)));
  }

  letterWidth = largest - smallest;
  letterHeight = largesty - smallesty;
 
}

function draw() {
  background(0);
  
  for (let s = 0; s < 5; s++){
    fill(125 + (s/4)*125, 80);
    beginShape();
    for (let i = 0; i < movePoints[s].length; i++) {
      let x1 = lerp(parseFloat(oldPoints[s][i].x), parseFloat(movePoints[s][i].x), easeInOutQuad(count/100));
      let y1 = lerp(parseFloat(oldPoints[s][i].y), parseFloat(movePoints[s][i].y), easeInOutQuad(count/100));
      vertex(450 + parseFloat(x1) - smallest - letterWidth / 2, 450 + (parseFloat(y1) - smallesty - letterHeight / 2));
    }
    endShape();
  }

  if (count == 100){
    for (let s = 0; s < 5; s++){
      for (let i = 0; i < pts.length; i++) {
        oldPoints[s][i].x = movePoints[s][i].x;
        oldPoints[s][i].y = movePoints[s][i].y;

        movePoints[s][i].x = pts[i].x + (noise(i/50,mCount+s)*(300/(s+1)))-(150/(s+1));
        movePoints[s][i].y = pts[i].y + (noise(i/50,mCount)*(300/(s+1)))-(150/(s+1));
      }
    }
    count=0;
  }

  count++;
  mCount++;
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}