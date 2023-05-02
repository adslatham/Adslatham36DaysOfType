let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let mCount = 0;
let tCount = 0;
let boxes = [];

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
  msg = "w";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.15 , // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });

  boxes = [];

  noStroke();
  background(0);

  largest = -10000;
  largesty = -10000;
  smallest = 10000;
  smallesty = 10000;

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
  frameRate(24);
  background(0)
  fill(255);
  stroke(255);
  strokeWeight(5);
  translate(450,450);

  //scale((sin(mCount*0.86)/8)+0.8)
  //rotate(sin(mCount)/5)

  /*
  g = drawingContext.createLinearGradient(450,-80,450,60);
  let c1 = color(50, 50, 50);
  let c2 = color(255,255,255);
  g.addColorStop(0,"rgba(0, 0, 0, 0.5)");
  g.addColorStop(1,"rgba(255, 255, 255, 0.5)");

  drawingContext.fillStyle = g;
  */



  for (let k = 1; k < 4; k++){
    var range = (100/k) * ((sin(mCount)+1.5)/3);
    var size = (200/k);


    for (let a = 1; a < pts.length; a++) {

      let ac = count - (tCount * pts.length);
      //let pos = (ac - (a+((k*50)*(sin(mCount)+1)) - range));
      let pos = (ac - (a - range));
      if (pos > pts.length){
        pos = pos - pts.length;
      }
      if (pos < 0){
        pos = pos + pts.length;
      }
      let s1 = (1-min(1,max(0,(abs(pos - range) / range))))

      stroke(50+(205*s1));
      //let sa = max(sa,sb);
      if (a == 10){
        console.log(s1);
      }
      let noiseX1 = ((noise(pts[a-1].x/10 + mCount + k)*size)-(size/2))*s1 + noise((a+k+(count/3))/60)*50;
      let noiseY1 = ((noise(pts[a-1].y/10 + mCount + k)*size)-(size/2))*s1 + noise((a+k+(count/3))/60)*50;
      let noiseX2 = ((noise(pts[a].x/10 + mCount + k)*size)-(size/2))*s1 + noise((a+k+(count/3))/60)*50;
      let noiseY2 = ((noise(pts[a].y/10 + mCount + k)*size)-(size/2))*s1 + noise((a+k+(count/3))/60)*50;
      line(pts[a-1].x - smallest - (letterWidth/2) + noiseX1, pts[a-1].y - smallesty -  letterHeight/2 + noiseY1, pts[a].x - smallest - (letterWidth/2) + noiseX2, pts[a].y - smallesty -  letterHeight/2 + noiseY2);
    }
  }

  tCount = floor(count/pts.length)
  count+=5;
  mCount+=0.03;
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