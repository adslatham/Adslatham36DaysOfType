let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let gCount = 0;
let randomPoints = [];
let currentPoints = [];
let hold = 0;

function preload() {
  font = loadFont("36DaysOfType.otf");
  img = loadImage("assets/Spot.png");
}

function setup() {
  count = 0;
  mCount = 0;
  createCanvas(900, 900);
  fSize = 900;
  textFont(font);
  textSize(fSize);
  msg = "r";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.3 , // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });
  console.log(pts); // { x, y, path angle }

  randomPoints = [];

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

    randomPoints.push([random(-450,450),random(-450,450)]);
  }

  letterWidth = largest - smallest;
  letterHeight = largesty - smallesty; 
}

function draw() {
  background(0)
  translate(450,450);

  beginShape();
  for (let a = 0; a < randomPoints.length; a++){
    let prog = easeInOutExpo(sin((((a/30)+count)/300)*PI));
    fill((1-(prog*2))*255,125);
    stroke(255);
    strokeWeight(0);
    let posX = lerp(pts[a].x - smallest - letterWidth / 2,randomPoints[a][0],prog) + (((noise((count+randomPoints[a][0])/100)*500)-250)*prog);
    let posY = lerp(pts[a].y-smallesty - letterHeight / 2,randomPoints[a][1],prog) + (((noise((count+randomPoints[a][1])/100)*500)-250)*prog);
    vertex(posX, posY);
  }
  endShape();

  for (let a = 0; a < randomPoints.length; a++){
    let prog = easeInOutExpo(sin((((a/30)+count)/300)*PI));
    fill(noise((a+gCount)/200)*255);
    stroke(255);
    strokeWeight(0);
    let posX = lerp(pts[a].x - smallest - letterWidth / 2,randomPoints[a][0],prog) + (((noise((gCount/100), randomPoints[a][0])*500)-250)*prog);
    let posY = lerp(pts[a].y-smallesty - letterHeight / 2,randomPoints[a][1],prog) + (((noise(randomPoints[a][1], gCount/100)*500)-250)*prog);
    circle(posX, posY, 6 + (prog)*5);
  }


  if (count == 300){
    if (hold < 50){
      hold++;
      if (hold == 50){
        count = 0;
        hold = 0;
        for (let i = 0; i < randomPoints.length; i++) {
          randomPoints[i][0] = random(-450,450);
          randomPoints[i][1] = random(-450,450);
        }

      }
    }
    count--;
  }

  count++;
  gCount++;
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

function inside(point, vs) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
  
  var x = point[0], y = point[1];
  
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i].x, yi = vs[i].y;
      var xj = vs[j].x, yj = vs[j].y;
      
      var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  
  return inside;
};
