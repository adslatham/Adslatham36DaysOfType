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
  msg = "f";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.05, // increase for more points
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

  var move = 2500;

  for (var i = 0; i < 600; i++) {
    boxes.push({
      x: random(-move, move),
      y: random(-move, move),
    });
  }
}

function draw() {
  background(0);
  fill(255);
  strokeWeight(2);
  stroke(255);

  ambientLight(50);
  pointLight(5, 5, 5, 0, 0, 100);

  rotateY(sin(count * 0.01) * 0.5);
  specularMaterial(250);

  for (var i = 0; i < pts.length; i++) {
    push();
    const p = pts[i];

    const p1 = rotatepoint(p.x, p.y, 10 + sin((i + count) / 50) * 10, i + count);
    const p2 = rotatepoint(p.x, p.y, 10 + sin((i + count) / 50) * 10, i + 180 + count);
    strokeWeight(sin((i + count) / 50) + 1);
    translate(0 + (p.x - smallest - letterWidth / 2), 0 + (p.y - smallesty - letterHeight / 2), sin(count / 50 + i) * 10);
    rotateZ(i / 10 + count * 0.01);
    rotateX(i / 10 + count * 0.01);
    rotateY(i / 10 + count * 0.01);
    var scale = sin(count / 100) * 5;
    box(scale, scale, sin(i + count / 50) * 50);
    //line(450 + (p1[0] - smallest - letterWidth / 2), 450 + (p1[1] - smallesty - letterHeight / 2), 450 + (p2[0] - smallest - letterWidth / 2), 450 + (p2[1] - smallesty - letterHeight / 2));
    //point(450 + (p.x - smallest - letterWidth / 2), 450 + (p.y - smallesty - letterHeight / 2));
    pop();
  }

  stroke(50);

  for (var i = 0; i < 600; i++) {
    push();
    ambientMaterial(125 + (sin(i + count / 50) + 0.5) * 125);
    translate(boxes[i].x, boxes[i].y, -800 - i * 0.01);
    box(900, 900, 500);
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
