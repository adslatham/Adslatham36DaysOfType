let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 20;
let mCount = 50;
let randomPoints = [];
let randomOutsidePoints = [];
let vectors = [-1,0,1];
let vectorBig = [-3,0,3];

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
    sampleFactor: 0.2 , // increase for more points
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

  for (let a = 0; a < 300; a+=0){
    var x1 = random(smallest, largest);
    var y1 = random(smallesty, largesty);
    if(inside([x1,y1], pts)){
      let vecx = vectors[round(random(0,2))];
      let vecy = vectors[round(random(0,2))];
      do {
        vecx = vectors[round(random(0,2))];
        vecy = vectors[round(random(0,2))];
      } while (vecx == 0 && vecy == 0);
      randomPoints.push({
        x: x1,
        y: y1,
        xVec: vecx,
        yVec: vecy
      });
      a++;
    }
  }

  for (let a = 0; a < 150; a+=0){
    var x1 = random(-500, 500);
    var y1 = random(-500, 500);
    let vecx = vectorBig[round(random(0,2))];
    let vecy = vectorBig[round(random(0,2))];
    do {
      vecx = vectorBig[round(random(0,2))];
      vecy = vectorBig[round(random(0,2))];
    } while (vecx == 0 && vecy == 0);
    randomOutsidePoints.push({
      x: x1,
      y: y1,
      xVec: vecx,
      yVec: vecy
    });
    a++;
  }

  console.log(randomPoints);

  letterWidth = largest - smallest;
  letterHeight = largesty - smallesty;
 
}

function draw() {
  //background(0,20);
  translate(450,450);

  for (let a = 0; a < randomPoints.length; a++){
    fill(noise((a+count)/20)*255);
    stroke(255);
    strokeWeight(0);

    randomPoints[a].x += randomPoints[a].xVec;
    randomPoints[a].y += randomPoints[a].yVec;
    if(inside([randomPoints[a].x,randomPoints[a].y], pts)){

      circle(0 + randomPoints[a].x - smallest - letterWidth / 2, 0 + (randomPoints[a].y - smallesty - letterHeight / 2),5);
    }else{
      //randomPoints[a].x = random(smallest, largest);
      //randomPoints[a].y = random(smallesty, largesty);
      randomPoints[a].x -= randomPoints[a].xVec;
      randomPoints[a].y -= randomPoints[a].yVec;

      let vecx = vectors[round(random(0,2))];
      let vecy = vectors[round(random(0,2))];
      do {
        vecx = vectors[round(random(0,2))];
        vecy = vectors[round(random(0,2))];
      } while (vecx == 0 && vecy == 0);

      randomPoints[a].xVec = vecx;
      randomPoints[a].yVec = vecy;
    }
    
  }

  for (let a = 0; a < randomOutsidePoints.length; a++){
    fill(noise((a+count)/20)*80)
    randomOutsidePoints[a].x += randomOutsidePoints[a].xVec;
    randomOutsidePoints[a].y += randomOutsidePoints[a].yVec;
    if(randomOutsidePoints[a].x < -450 || randomOutsidePoints[a].y < -450 || randomOutsidePoints[a].x > 450 || randomOutsidePoints[a].y > 450){
      //randomPoints[a].x = random(smallest, largest);
      //randomPoints[a].y = random(smallesty, largesty);
      randomOutsidePoints[a].x -= randomOutsidePoints[a].xVec;
      randomOutsidePoints[a].y -= randomOutsidePoints[a].yVec;

      let vecx = vectors[round(random(0,2))];
      let vecy = vectors[round(random(0,2))];
      do {
        vecx = vectors[round(random(0,2))];
        vecy = vectors[round(random(0,2))];
      } while (vecx == 0 && vecy == 0);

      randomOutsidePoints[a].xVec = vecx;
      randomOutsidePoints[a].yVec = vecy;
    }else{
      circle(randomOutsidePoints[a].x, randomOutsidePoints[a].y,10);
    }
    
  }

  count++;
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
