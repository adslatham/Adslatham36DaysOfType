let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;

function preload() {
    font = loadFont('36DaysOfType.otf')
    img = loadImage('assets/Spot.png');
}

function setup() {
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = 'e'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.1, // increase for more points
        simplifyThreshold: 0.0 // increase to remove collinear points
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
        if (pts[i].x > largest){
            largest = pts[i].x;
        }
        if (pts[i].x < smallest){
            smallest = pts[i].x;
        }
        if (pts[i].y > largesty){
            largesty = pts[i].y;
        }
        if (pts[i].y < smallesty){
            smallesty = pts[i].y;
        }
    }

    letterWidth = largest-smallest;
    letterHeight = largesty-smallesty;
    
  }

  function draw() {
    background(0);
    noStroke(0); 
    fill(255);


    for (let j = 0; j < 10; j++){
        beginShape();
        var size = 0.1 + (j*0.3);
        var noiseWidth = 100;
        fill(j*25.5);
        stroke(255, 255, 255, j*25.5);
        strokeWeight(1);
        for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            vertex(450 + (p.x + (noise(count+(i/(j*10)), j)*noiseWidth)-(noiseWidth/2) - smallest - (letterWidth/2))/size, 450 + (p.y + (noise(count+(i/(j*10)), j)*noiseWidth)-(noiseWidth/2) - smallesty -  letterHeight/2)/size);
        }
        endShape(CLOSE);
    }

    count+=0.01;
  }
