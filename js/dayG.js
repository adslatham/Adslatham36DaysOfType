let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let outsidepts = [];
let insidepts = [];
let count = 0;
let boxes = [];
let buffer;
let squaresCount = 50;
let boxSize = 300;
let newBoxSize = 300;
let boxSizeGap = -3.53;
let paused = false;
let rCount = 0;

function preload() {
  font = loadFont("36DaysOfType.otf");
}

function setup() {
  createCanvas(900, 900, WEBGL);
  squaresCount = 50;
  boxSize = 300;
  newBoxSize = 300;
  boxSizeGap = -3.53;
  fSize = 900;
  count = 0;
  rCount = 0;
  textFont(font);
  textSize(fSize);
  msg = "g";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.1, // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });

  stroke(255);
  strokeWeight(2);

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
  outsidepts.push(pts[0]);
  var lineEdit = 0;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    let p1;
    if (i > 0){
        p1 = pts[i-1];
    }else{
        p1 = pts[pts.length-1];
    }
    if (abs(p.y - p1.y) > 5 && i != 0){
      lineEdit++;
    }else if (lineEdit > 0){
      outsidepts.push(p);
    }
  }

  let xPos = smallest;
  let yPos = smallesty;

  for (let xPos = smallest; xPos < largest; xPos+=boxSize){
    for (let yPos = smallesty; yPos < largesty; yPos+=boxSize){
      if (inside([xPos,yPos], pts)){
        insidepts.push([xPos,yPos]);
      }
    }
  }

  letterWidth = largest - smallest;
  letterHeight = largesty - smallesty;
}

let randAmount;

function draw() {
  var sCount = count/50;
  background(0);
  rotateY(sin(rCount*0.3)*0.5);
  stroke(80);
  strokeWeight(10);
  //scale(1 + (cos(rCount/2)+0.5)/2)

  /*
  for (let i = 0; i < pts.length; i++){
    push();
    fill(10);
    translate(0 + (pts[i].x - smallest - letterWidth / 2), 0 + (pts[i].y - smallesty - letterHeight / 2), max(0,sin((i/50)+sCount)*50));
    point(easeInOutSine(sin((pts[i][0] + pts[i][1])/300 + sCount)+0.5)*PI);
    pop();
  }
  */

  stroke(255);
  strokeWeight(1);

  fill(150);

  for (let i = 0; i < insidepts.length; i++){
    push();
    fill(noise((insidepts[i][0] - insidepts[i][1])/300 + sCount)*300);
    translate(0 + (insidepts[i][0] - smallest - letterWidth / 2), 0 + (insidepts[i][1] - smallesty - letterHeight / 2), max(0,sin((i/50)+sCount)*50));
    rotateY(easeInOutSine(sin((insidepts[i][0] + insidepts[i][1])/300 + sCount)+0.5)*PI);
    box(boxSize,boxSize,boxSize);
    pop();
  }
  count+=1;
  if (paused == false){
    rCount+=0.05;
  }

  if (count % 160 == 0){
    var newSize = round(random(30, 50))
    if (count % 320 == 0){
      newSize = round(random(12, 20))
    }
    console.log(newSize);
    boxSizeGap = (parseFloat(newSize - boxSize)/80); 
    console.log(boxSizeGap);
  }

  if (count % 160 < 80){
    boxSize += boxSizeGap;
    console.log("bs" + boxSize)
    insidepts = [];
    for (let xPos = smallest; xPos < largest; xPos+=boxSize){
      for (let yPos = smallesty; yPos < largesty; yPos+=boxSize){
        if (inside([xPos,yPos], pts)){
          insidepts.push([xPos,yPos]);
        }
      }
    }
  }

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

function pause(){
  paused = paused ? false :true;
}