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

    for (let j = 0; j < 5; j++){
        for (let r = 0; r < 5; r++){
            push();
            translate(r*180-45, (j*180)+15);
            fill(noise(10*j + r + (count/300))*150);
            rect(45,-10,180,180);
            beginShape();

            fill(noise(10*j + r + (count/200))*255);

            var size = 20;

            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];
                vertex(((p.x - smallest)/4.5 + 65)+(noise((i+j+r+count)/100, r)*size), ((p.y - smallesty)/4.5 + 10)+(noise((i+j+r+count)/100, r+j)*size));
            }

            endShape(CLOSE);
            pop();
        }
    }
    count++;
  }
