let font;
let fSize; // font size
let msg; // text to write
let pts = [];
let bPts = [];

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
  msg = "y";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.06 , // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });

  largest = -10000;
  largesty = -10000;
  smallest = 10000;
  smallesty = 10000;

  for (let i = 0; i < pts.length; i++) {
      if (pts[i].x > largest){
          largest = pts[i].x;
      }
      if (pts[i].x < smallest){
          smallest = pts[i].x;
      }
      if (pts[i].y > largesty){
          largesty = pts[i].y;
      }
      if (pts[i].y < smallesty){
          smallesty = pts[i].y;
      }
  }

  letterWidth = largest-smallest;
  letterHeight = largesty-smallesty;

  opentype.load('36DaysOfType.otf', function (err, f) {
    font = f
    let xa = -408
    let ya = 280
    path = font.getPath(msg, xa, ya, 900);
    console.log(path);
  });

  for(let i = 0; i < 1500; i++){
    bPts.push({
      x: random(-340,340),
      y: random(-1400,-450),
      yV: 5,
      xV: random(-1,1),
      stop: 0
    });
  }

  noStroke();
  background(0);
}

let hold = 0;

function draw() {
  background(0,20)
  translate(450,450);

  fill(0);
  stroke(255);
  strokeWeight(3);

  for (let cmd of path.commands) {
    if (cmd.type === 'M') {
        beginShape()
        vertex(cmd.x , cmd.y)
    } else if (cmd.type === 'L') {
        vertex(cmd.x, cmd.y)
    } else if (cmd.type === 'C') {
        bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
    } else if (cmd.type === 'Q') {
        quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y)
    } else if (cmd.type === 'Z') {
        vertex(path.commands[0].x, path.commands[0].y)
        endShape();
    }
  }

  noStroke();

  for (let p = 0; p < bPts.length; p++){
    fill(150, (10-bPts[p].stop)*25.5);
    circle(bPts[p].x, bPts[p].y, 10);
    bPts[p].x += bPts[p].xV;
    bPts[p].y += bPts[p].yV;
    bPts[p].yV += 0.1;
    bPts[p].yV = min(bPts[p].yV, 5);
    if (inside([bPts[p].x, bPts[p].y], pts)){
      var newSpeeds = getOutputSpeedXY([bPts[p].x, bPts[p].y], pts);
      bPts[p].x = newSpeeds[1][0] - smallest - letterWidth/2;
      bPts[p].y = newSpeeds[1][1] - smallesty- letterHeight/2;
      bPts[p].xV = min(5, newSpeeds[0][0]);
      bPts[p].yV = min(5, newSpeeds[0][1]);
      bPts[p].x += bPts[p].xV;
      bPts[p].y += bPts[p].yV;
      bPts[p].stop++;
      if (bPts[p].stop > 10){
        bPts[p].x = random(-340,340)*(0.7+(sin(count)/2));
        bPts[p].y = random(-490,-450);
        bPts[p].xV = random(-1,1);
        bPts[p].yV = 5;
        bPts[p].stop = 0;
      }
    }
    if (bPts[p].y > 450){
      bPts[p].x = random(-340,340)*(0.7+(sin(count)/2));
      bPts[p].y = random(-490,-450);
      bPts[p].xV = random(-1,1);
      bPts[p].yV = 5;
      bPts[p].stop = 0;
    }
  }

  fill(20);
  stroke(220);
  strokeWeight(2);

  for (let cmd of path.commands) {
    if (cmd.type === 'M') {
        beginShape()
        vertex(cmd.x , cmd.y)
    } else if (cmd.type === 'L') {
        vertex(cmd.x, cmd.y)
    } else if (cmd.type === 'C') {
        bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
    } else if (cmd.type === 'Q') {
        quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y)
    } else if (cmd.type === 'Z') {
        vertex(path.commands[0].x, path.commands[0].y)
        endShape();
    }
  }

  /*
  beginShape();
  for (let p = 0; p < pts.length; p++){
    vertex(pts[p].x - smallest - letterWidth/2, pts[p].y - smallesty- letterHeight/2);
  }
  endShape();

  */

  count+=0.02;

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
      var xi = vs[i].x - smallest - letterWidth/2, yi = vs[i].y - smallesty- letterHeight/2;
      var xj = vs[j].x - smallest - letterWidth/2, yj = vs[j].y - smallesty- letterHeight/2;
      
      var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  
  return inside;
};

function getOutputSpeedXY(point, vs){
  let nearest1Dist = 100000;
  let nearest2Dist = 100000;
  let nearest1Ind = -1;
  let nearest2Ind = -1;
  for (var i = 0; i < vs.length; i++) {

    let x = vs[i].x - smallest- letterWidth/2;
    let y = vs[i].y - smallesty- letterHeight/2;

    let distX = Math.hypot(x-point[0], y-point[1]);
    if (distX < nearest1Dist){
      nearest2Dist = nearest2Dist;
      nearest2Ind = nearest1Ind;
      nearest1Dist = distX;
      nearest1Ind = i;
    }
    else if (distX < nearest2Dist){
      nearest2Dist = distX;
      nearest2Ind = i;
    }
  }

  let dy, dx;

  if (vs[nearest1Ind].y > vs[nearest2Ind].y){
    dy = vs[nearest1Ind].y - vs[nearest2Ind].y;
    dx = vs[nearest1Ind].x - vs[nearest2Ind].x;
  }else{
    dy = vs[nearest2Ind].y - vs[nearest1Ind].y;
    dx = vs[nearest2Ind].x - vs[nearest1Ind].x;
  }

  var theta = Math.atan2(dy, dx) - random(-180,180);
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]

  var xSpeed = Math.cos(theta) * 5;
  var ySpeed = Math.sin(theta) * 5;

  var py = (vs[nearest2Ind].y + vs[nearest1Ind].y) / 2;
  var px = (vs[nearest2Ind].x + vs[nearest1Ind].x) / 2;
  
  return [[xSpeed,ySpeed], [px, py]];
}