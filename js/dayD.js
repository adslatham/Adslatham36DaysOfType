let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let lines = [];
var numLines = 80;

function preload() {
    font = loadFont('36DaysOfType.otf')
    img = loadImage('assets/Spot.png');
}

function setup() {
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = 'd'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.1, // increase for more points
        simplifyThreshold: 0.0 // increase to remove collinear points
    });
    console.log(pts); // { x, y, path angle }

    stroke(255);
    strokeWeight(8);
    noFill();
    
    for (var j = 0; j < numLines; j++){
        lines.push(
            {
                pos:random(),
                width:1 + random()*10,
                color:random()*255,
                speed:random(0.002,0.004),
                scale:1
            });
    }

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

    for (let j = 0; j < numLines; j++){

        push();

        strokeWeight(lines[j].width);
        stroke(lines[j].color);

        var speed = 200;
        var dist = 10;

        var pos = floor((pts.length-1) * lines[j].pos);

        var lower = pos;
        var upper = pos + 40;

        
        for (let i = lower; i < upper; i++) {
            let p;

            if (i + 1 > pts.length){
                p = pts[i - pts.length];
            }
            else{
                p = pts[i];
                p1 = pts[i+1];
            }

            dist = 10 * sin(count/100);

            translate((-dist/2) + (noise(((j*100)+count)/speed)*dist), (-dist/2) + (noise(((j*100)+count)/speed))*dist);

            point(450 + p.x - smallest - (letterWidth/2), 450 + p.y - smallesty -  letterHeight/2);
        }

        lines[j].pos+=lines[j].speed;

        if (lines[j].pos >= 1){
            lines[j].pos = 0;
        }
        pop();
    }
    count++;
  }
