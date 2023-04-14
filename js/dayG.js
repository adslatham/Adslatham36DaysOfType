let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let boxes = [];
let buffer;
let tShader;
let squaresCount = 50;
let masterCount = 0;

function preload() {
  font = loadFont("36DaysOfType.otf");
  tShader = loadShader("shaders/mosaic/effect.vert", "shaders/mosaic/effect.frag");
}

function setup() {
  createCanvas(900, 900, WEBGL);
  buffer = createGraphics(900, 900, WEBGL);
  pastFrame = createGraphics(900, 900, WEBGL);

  fSize = 900;
  buffer.textFont(font);
  buffer.textSize(fSize);
  msg = "g";
  pts = font.textToPoints(msg, 0, 0, fSize, {
    sampleFactor: 0.05, // increase for more points
    simplifyThreshold: 0.0, // increase to remove collinear points
  });

  buffer.stroke(255);
  buffer.strokeWeight(8);

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

let randAmount;

function draw() {
  buffer.background(0);
  buffer.stroke(255);
  buffer.strokeWeight(1);

  var gap = 5;
  var num = 50;
  for (var t = 0; t < 50; t++) {
    buffer.push();
    buffer.fill(255 * ((t + 1) / 50));
    buffer.translate(0, 0, (t - 25) * gap);
    buffer.text(msg, -450, 350);
    buffer.pop();
  }

  shader(tShader);
  tShader.setUniform("tex0", buffer);
  tShader.setUniform("resolution", [width, height]);
  tShader.setUniform("amt", (sin(count / 150) + 0.5) / 10);
  tShader.setUniform("squares", squaresCount);
  rect(0, 0, width, height);

  if (count % 120 < 10) {
    if (count % 120 == 0) {
      if (masterCount % 2 == 0){
        randAmount = random(-3, 3);
        squaresCount = randAmount;
      }else{
        randAmount = (squaresCount/10);
        squaresCount = 0;
      }
      masterCount++;
    }
    squaresCount += randAmount;
    buffer.push();
    buffer.rotateY(sin(randAmount * 0.1) * 0.1);
    scale(1 + sin(count) * 5);
    buffer.pop();
  }

  count += 1;

  image(buffer, -width / 2, -height / 2, width, height);
}
