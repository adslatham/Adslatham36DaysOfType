let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 20;
let mCount = 50;
let boxes = [];

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
  msg = "t";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.15 , // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });
  console.log(pts); // { x, y, path angle }

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

  var yCount = 0;
  for(let y = smallesty; y <= largesty; y+=20){
    var xCount = 0;
    for (let x = smallest; x <= largest; x+=20){
      if (inside([x,y], pts)){
        boxes.push({x:x, y:y, xCount:xCount, yCount:yCount, direction:1, directionB:1});
      }
      xCount++;
    }
    yCount++;
  }

  for (let a = 0; a < boxes.length; a++){
    boxes[a].progress = round(((a+1)/boxes.length)*100)/100
    boxes[a].progressB = noise(a/60);
  }

  console.log(boxes.length);

  letterWidth = largest - smallest;
  letterHeight = largesty - smallesty;
 
}

function draw() {
  background(0)
  fill(255);
  stroke(255);
  translate(450,450)
  strokeCap(SQUARE);

  var radius = 15;

  for (let a = 0; a < boxes.length; a++){    
    let extraX = 0;
    if (boxes[a].yCount % 2 == 0){
      extraX = 5;
    }

    let yAngle = 90 - (boxes[a].xCount*2) + (count*3); 
    if (boxes[a].yCount % 2 == 0){
      yAngle = 180 + (boxes[a].xCount*5) + (count*3); 
    }

    strokeWeight(1+(5*sin(boxes[a].progress*PI)));
    stroke(155 + noise(a+count/20)*100);

    //let angle = yAngle + 600*boxes[a].progress + (boxes[a].yCount*sin((count/3) + a))
    let angle = yAngle - 80 * easeInOutQuad(boxes[a].progress);
    let rad = 2 + radius * easeInOutElastic(boxes[a].progressB);

    let x = boxes[a].x - smallest - (letterWidth/2) - extraX + Math.cos(angle * (PI/180)) * rad;
    let y = boxes[a].y - smallesty -  letterHeight/2 + Math.sin(angle * (PI/180)) * rad;

    if (boxes[a].direction == -1){
      boxes[a].progress -= 0.02;
    }
    if (boxes[a].direction == 1){
      boxes[a].progress += 0.02;
    }

    if (boxes[a].progress < 0){
      boxes[a].progress = 0;
      boxes[a].direction = 1;
    }
    if (boxes[a].progress > 1){
      boxes[a].progress = 1;
      boxes[a].direction = -1;
    }

    if (boxes[a].directionB == -1){
      boxes[a].progressB -= 0.008;
    }
    if (boxes[a].directionB == 1){
      boxes[a].progressB += 0.008;
    }

    if (boxes[a].progressB < 0){
      boxes[a].progressB = 0;
      boxes[a].directionB = 1;
    }
    if (boxes[a].progressB > 1){
      boxes[a].progressB = 1;
      boxes[a].directionB = -1;
    }

    //point(boxes[a].x - smallest - (letterWidth/2) - extraX, boxes[a].y - smallesty -  letterHeight/2, 20);
    //point(x - smallest - (letterWidth/2) - extraX, y - smallesty -  letterHeight/2, 20);
    
    line(boxes[a].x - smallest - (letterWidth/2) - extraX, boxes[a].y - smallesty -  letterHeight/2, x, y)
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

function rotatepoint(cx, cy, x, y, angle) {
  var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return [nx, ny];
}