let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 20;
let mCount = 50;
let boxes = [];
let randomPoints = [];

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
  msg = "u";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.5 , // increase for more points
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
 

  for (let i = 0; i < pts.length; i++) {
    let ran = random(0,80);
    randomPoints.push({
      x:random(-350,350),
      y:random(-350,350),
      px:parseFloat("" + (pts[i].x  - smallest - letterWidth/2)),
      py:parseFloat("" + (pts[i].y - smallesty -  letterHeight/2)),
      noise:random(0,400),
      progressEnd:ran,
      progressStart:ran+10,
      hold:0
    });
  }
}

function draw() {
  background(0,50)
  fill(255);
  translate(450,450)
  strokeCap(ROUND);


  var noiseSize = 0;

  for (let a = 0; a < randomPoints.length; a++){

    var p1 = midpoint(randomPoints[a].x + (noise(randomPoints[a].noise + count)*noiseSize)-(noiseSize/2), randomPoints[a].y + (noise(randomPoints[a].noise + count)*noiseSize)-(noiseSize/2), randomPoints[a].px, randomPoints[a].py, easeInOutExpo(randomPoints[a].progressEnd/100));
    var p2 = midpoint(randomPoints[a].x + (noise(randomPoints[a].noise + count)*noiseSize)-(noiseSize/2), randomPoints[a].y + (noise(randomPoints[a].noise + count)*noiseSize)-(noiseSize/2), randomPoints[a].px, randomPoints[a].py, easeInOutExpo(randomPoints[a].progressStart/100));
    
    if (randomPoints[a].progressStart < 100){
      randomPoints[a].progressStart+=0.5;
    }
    if (randomPoints[a].progressEnd < 100 && randomPoints[a].progressStart > 10){
      randomPoints[a].progressEnd+=0.5;
    }
    if (randomPoints[a].progressEnd > 95 && randomPoints[a].progressStart > 95 && randomPoints[a].hold < 110){
      noStroke(255);
      if (randomPoints[a].hold < 60){    
        circle(p1[0], p1[1], 5)
      }
      randomPoints[a].hold++;
      if (randomPoints[a].hold == 110){
        randomPoints[a].hold = 0;
        randomPoints[a].progressEnd = 0;
        randomPoints[a].progressStart = 0;
        randomPoints[a].x = random(-350,350);
        randomPoints[a].y = random(-350,350);
      }
    }
    else{
      stroke((randomPoints[a].progressStart/100)*255);    
      strokeWeight(1);
      line(p1[0], p1[1] , p2[0], p2[1])
    }



  }

  count+=0.04;
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

function midpoint(lat1, long1, lat2, long2, per) {
  return [lat1 + (lat2 - lat1) * per, long1 + (long2 - long1) * per];
}