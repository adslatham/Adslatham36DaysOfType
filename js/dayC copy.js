let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let lines = [];
var numLines = 80;

function preload() {
  font = loadFont("36DaysOfType.otf");
}

function setup() {
  createCanvas(900, 900);
  fSize = 900;
  textFont(font);
  textSize(fSize);
  msg = "c";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.5, // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });
  console.log(pts); // { x, y, path angle }

  stroke(255);
  strokeWeight(8);
  noFill();

  for (var j = 0; j < numLines; j++) {
    lines.push({
      pos: random(),
      width: 1 + random() * 15,
      color: random() * 255,
      speed: random(0.001, 0.002),
      scale: 0.8 + random() * 0.4,
      length: 80 + random() * 10,
    });
  }

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

  for (let k = 1; k < pts.length; k++) {
    let p0 = pts[k];
    let p01 = pts[k - 1];
    strokeWeight(2);
    stroke(80);
    line(450 + p0.x - smallest - letterWidth / 2, 450 + p0.y - smallesty - letterHeight / 2, 450 + p01.x - smallest - letterWidth / 2, 450 + p01.y - smallesty - letterHeight / 2);
  }
  line(450 + pts[0].x - smallest - letterWidth / 2, 450 + pts[0].y - smallesty - letterHeight / 2, 450 + pts[pts.length - 1].x - smallest - letterWidth / 2, 450 + pts[pts.length - 1].y - smallesty - letterHeight / 2);

  for (let j = 0; j < numLines; j++) {
    push();

    strokeWeight(lines[j].width);
    stroke(lines[j].color);

    var pos = floor((pts.length - 1) * lines[j].pos);

    var lower = pos;
    var upper = pos + lines[j].length;

    var s = lines[j].scale;

    /*for (let i = lower; i < upper; i++) {
      let p, p1;

      if (i + 1 > pts.length) {
        p = pts[i - pts.length];
        p1 = pts[i + 1 - pts.length];
      } else if (i == pts.length - 1) {
        p = pts[i];
        p1 = pts[0];
      } else {
        p = pts[i];
        p1 = pts[i + 1];
      }

      line(450 + (p.x - smallest - letterWidth / 2) * s, 450 + (p.y - smallesty - letterHeight / 2) * s, 450 + (p1.x - smallest - letterWidth / 2) * s, 450 + (p1.y - smallesty - letterHeight / 2) * s);
    }*/
    let p, p1;

    if (lower > pts.length - 1) {
      lower = lower - pts.length;
    }
    if (lower < 0) {
      lower = lower + pts.length;
    }
    if (upper > pts.length - 1) {
      upper = upper - pts.length;
    }
    if (upper < 0) {
      upper = upper + pts.length;
    }
    p = pts[parseInt(lower)];
    p1 = pts[parseInt(upper)];

    line(450 + (p.x - smallest - letterWidth / 2) * s, 450 + (p.y - smallesty - letterHeight / 2) * s, 450 + (p1.x - smallest - letterWidth / 2) * s, 450 + (p1.y - smallesty - letterHeight / 2) * s);

    lines[j].pos += lines[j].speed * (1.1 + sin(count / 50));

    if (lines[j].pos >= 1) {
      lines[j].pos = 0;
    }
    pop();
  }
  count++;
}
