let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let boxes = [];

function preload() {
  font = loadFont("36DaysOfType.otf");
  img = loadImage("assets/Spot.png");
}

function setup() {
  createCanvas(900, 900, WEBGL);
  fSize = 900;
  textFont(font);
  textSize(fSize);
  msg = "h";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.03, // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });
  console.log(pts); // { x, y, path angle }

  stroke(255);
  strokeWeight(8);
  noFill();

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
  background(0);
  fill(255);
  strokeWeight(2);
  stroke(255);

  //ambientLight(80);
  //pointLight(5, 5, 5, 0, 0, 100);

  rotateY(easeInOutBack(0.5 + sin(count * 0.005)) - 0.25);

  for (var i = 0; i < pts.length; i++) {
    push();
    var ease = easeInOutSine(0.5 + sin((count + i) / 80));
    var rotate = easeInOutExpo(0.5 + sin((count + i) / 60)) * 2;
    const p = pts[i];
    const p1 = rotatepoint(p.x, p.y, 10 + sin((i + count) / 50) * 10, i + count);
    const p2 = rotatepoint(p.x, p.y, 10 + sin((i + count) / 50) * 10, i + 180 + count);
    strokeWeight(1);
    fill(noise(i / 10 + count / 80) * 150);
    translate(0 + (p.x - smallest - letterWidth / 2), 0 + (p.y - smallesty - letterHeight / 2), sin(count / 50 + i) * max(0, (0.5 + sin(count / 50)) * 80));
    //rotateZ(rotate);
    rotateY(rotate);
    rotateZ(rotate * 3);
    var scale = ease * 50;
    box(scale, scale, scale);
    //line(450 + (p1[0] - smallest - letterWidth / 2), 450 + (p1[1] - smallesty - letterHeight / 2), 450 + (p2[0] - smallest - letterWidth / 2), 450 + (p2[1] - smallesty - letterHeight / 2));
    //point(450 + (p.x - smallest - letterWidth / 2), 450 + (p.y - smallesty - letterHeight / 2));
    pop();
  }

  count += 1;
}

function rotatepoint(cx, cy, radius, angle) {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * radius + sin * radius + cx,
    ny = cos * radius - sin * radius + cy;
  return [nx, ny];
}
