let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let path; // store path data
let count = 20;
let mCount = 50;
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
  msg = "v";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.15 , // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });
  opentype.load('36DaysOfType.otf', function (err, f) {
    font = f
    let xa = -50
    let ya = 30
    path = font.getPath(msg, xa, ya, 100)
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

  var yCount = 0;
  for(let y = smallesty; y <= largesty; y+=50){
    var xCount = 0;
    for (let x = smallest; x <= largest; x+=45){
      if (inside([x,y], pts)){
        boxes.push({x:x, y:y, xCount:xCount, yCount:yCount, direction:1, directionB:1, rot:((yCount*xCount)*0.01)});
      }
      xCount++;
    }
    yCount++;
  }

  for (let a = 0; a < boxes.length; a++){
    boxes[a].progress = round(((a+1)/boxes.length)*100)/100
    boxes[a].progressB = noise(a/60);
  }

  letterWidth = largest - smallest;
  letterHeight = largesty - smallesty;

 
}

function draw() {
  if (count == 0){
    background(0);
  }
  background(0,20)
  fill(255);
  noStroke();
  translate(450,450)

  scale(1+(sin(count/20)*0.1))
  
  g = drawingContext.createLinearGradient(450,-80,450,60);
  let c1 = color(50, 50, 50);
  let c2 = color(255,255,255);
  g.addColorStop(0,"rgba(0, 0, 0, 0.5)");
  g.addColorStop(1,"rgba(255, 255, 255, 0.5)");

  drawingContext.fillStyle = g;

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

    //let angle = yAngle + 600*boxes[a].progress + (boxes[a].yCount*sin((count/3) + a))
    let angle = yAngle - 80 * easeInOutQuad(boxes[a].progress);
    let rad = 2 + radius * easeInOutElastic(boxes[a].progressB);

    let x = boxes[a].x - smallest - (letterWidth/2) - extraX + easeInOutQuad(0.5+sin((a*50+count)/50))*10;
    //let x = boxes[a].x - smallest - (letterWidth/2);
    let y = boxes[a].y - smallesty -  letterHeight/2 + max(0, sin(a*150+count/50)*10);
    //let y = boxes[a].y - smallesty -  letterHeight/2;

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

    boxes[a].rot+=(easeInOutQuad(sin((a/50)+(count/80))+0.5)*0.1)

    //point(boxes[a].x - smallest - (letterWidth/2) - extraX, boxes[a].y - smallesty -  letterHeight/2, 20);
    //point(x - smallest - (letterWidth/2) - extraX, y - smallesty -  letterHeight/2, 20);
    //line(boxes[a].x - smallest - (letterWidth/2) - extraX, boxes[a].y - smallesty -  letterHeight/2, x, y)

    //fill(255,60);
    //console.log(path);
    push();
    translate(0 + x, 0 + y)
    scale(1+(sin((a+count)/15))*0.5)
    rotate(boxes[a].rot);
    for (let cmd of path.commands) {
      if (cmd.type === 'M') {
          beginShape()
          vertex(cmd.x, cmd.y)
      } else if (cmd.type === 'L') {
          vertex(cmd.x, cmd.y)
      } else if (cmd.type === 'C') {
          bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
      } else if (cmd.type === 'Q') {
          quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y)
      } else if (cmd.type === 'Z') {
          endShape();
      }
    }
    pop();
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