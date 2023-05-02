let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let path;
let pathA = [];
let pathB = [];
let count = 0;
let mCount = 0;
let tCount = 0;
let boxes = [];

let range = 500;
let changer = 250

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
  msg = "x";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.15 , // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });
  opentype.load('36DaysOfType.otf', function (err, f) {
    font = f
    let xa = -430
    let ya = 320
    path = font.getPath(msg, xa, ya, 900);

    for (let c = 0; c < path.commands.length; c++){
      pathA.push({
        x: parseFloat("" + (path.commands[c].x)),
        y: parseFloat("" + (path.commands[c].y))
      })
      pathB.push({
        x: parseFloat("" + (path.commands[c].x + ((noise(mCount+path.commands[c].x/200)*range)-(range/2)))),
        y: parseFloat("" + (path.commands[c].y + ((noise(mCount+path.commands[c].y/200)*range)-(range/2))))
      })
    }
    console.log(path.commands);
    console.log(pathB);
  });

  noStroke();
  background(0);
}

let hold = 0;

function draw() {
  background(0)
  noStroke();
  translate(450,450);

  for (var i = 1; i < 11; i++){
    
    fill(i*25.5);

    let prog = easeInOutElastic((count-(i*5)) / changer);

    for (let c = 0; c < pathB.length; c++) {
      if (c == 0){
        beginShape();
      }
      vertex(lerp(pathA[c].x*(3/i), pathB[c].x*(3/i), prog), lerp(pathA[c].y*(3/i), pathB[c].y*(3/i), prog))
      if (c == (pathB.length -1)){
        endShape();
      }
    }
  }

  /*
  push();
  scale (1);
  noFill();
  strokeWeight(2);
  //fill(150);

    let prog = easeInOutElastic((count) / changer);

    for (let c = 0; c < pathB.length; c++) {
      stroke(0,110);
      circle(lerp(pathA[c].x, pathB[c].x, prog), lerp(pathA[c].y, pathB[c].y, prog),20)
      stroke(255,120);
      circle(lerp(pathA[c].x, pathB[c].x, prog), lerp(pathA[c].y, pathB[c].y, prog),40)
      stroke(255,50);
      circle(lerp(pathA[c].x, pathB[c].x, prog), lerp(pathA[c].y, pathB[c].y, prog),60)
    }
  pop();

  */

  count+=5;

  if (count > changer){
    if (hold > 30){
      hold = 0;
      count = 0;
      mCount++;
      if (mCount % 5 == 0){
        for (let c = 0; c < path.commands.length; c++){
          pathA[c].x = parseFloat("" + pathB[c].x)
          pathA[c].y = parseFloat("" + pathB[c].y)
          pathB[c].x = parseFloat("" + (path.commands[c].x));
          pathB[c].y = parseFloat("" + (path.commands[c].y));
        }
      }else{
        for (let c = 0; c < path.commands.length; c++){
          pathA[c].x = parseFloat("" + pathB[c].x)
          pathA[c].y = parseFloat("" + pathB[c].y)
          pathB[c].x = parseFloat("" + (path.commands[c].x + ((noise(mCount+path.commands[c].x/200)*range)-(range/2))));
          pathB[c].y = parseFloat("" + (path.commands[c].y + ((noise(mCount+path.commands[c].y/200)*range)-(range/2))));
        }
      }
    }else{
      hold++;
    }
  }
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