let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;

function preload() {
    font = loadFont('36DaysOfType.otf')
}

function setup() {
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = 'a'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.1, // increase for more points
        simplifyThreshold: 0.0 // increase to remove collinear points
    });
    console.log(pts); // { x, y, path angle }

    stroke(255);
    strokeWeight(8);
    noFill();
    
  }

  function draw() {
    background(0);
    push();
    translate(60, height*5/8);

    const yOffset = 180;
    const xOffset = -50
    for (let j = 0; j < 10; j++){
        for (let i = 1; i < pts.length; i++) {
            const p = pts[i];
            const p1 = pts[i-1];
            var n = (noise((count+i+(j*100))/100)*100);
            stroke(255/(10-j) * noise((i/50)+count/50));
            if ((p.x - p1.x) < 20){
                //line(p.x + xOffset + n, p.y + yOffset + n, p1.x + xOffset + n, p1.y + yOffset + n);
            }
            point(p.x + xOffset + n, p.y + yOffset + n);
        }
    }
    pop();
    count++;
  }
