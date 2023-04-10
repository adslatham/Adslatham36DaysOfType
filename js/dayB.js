let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let pg;

function preload() {
    font = loadFont('36DaysOfType.otf')
}

function setup() {
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = 'b'
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

    pg = createGraphics(900,900);
    
    pg.beginShape();
    pg.fill(0);
    for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        const p1 = pts[i-1];
        if (abs(p.y - p1.y) > 20){
            pg.endShape();
            pg.beginShape();
        }
        pg.vertex(450 + p.x - smallest - (letterWidth/2), 450 + p.y - smallesty -  letterHeight/2);
    }
    pg.endShape();
    pg.beginShape();
    pg.erase();
    for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        let p1;
        if (i > 0){
            p1 = pts[i-1];
        }else{
            p1 = pts[pts.length-1];
        }
        if (abs(p.y - p1.y) > 20 && i != 0){
            pg.endShape();
            pg.noErase();
            i = pts.length;
        }
        pg.vertex(450 + p.x - smallest - (letterWidth/2), 450 + p.y - smallesty -  letterHeight/2);
    }
    
  }

  function draw() {
    background(0);

    const yOffset = 700;
    const xOffset = 20

    fill(255);
    strokeWeight(1); 

    push();
    for (let i = 0; i < pts.length; i++) {
        stroke(noise((i+count)/50)*255);
        const p = pts[i];
        const r = rotatepoint(450,450, 450+(p.x - smallest - (letterWidth/2))*50, 450 + (p.y - smallesty -  letterHeight/2)*50,noise(i/50)*count);
        line(450 + p.x - smallest - (letterWidth/2), 450 + p.y - smallesty -  letterHeight/2, r[0], r[1]);
    }
    pop();

    strokeWeight(6); 

    push();
    for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        let p1;
        if (i > 0){
            p1 = pts[i-1];
        }else{
            p1 = pts[pts.length-1];
        }
        stroke(noise((i+count)/50)*255);
        if (abs(p.y - p1.y) < 30){
            line(450 + p.x - smallest - (letterWidth/2), 450 + p.y - smallesty -  letterHeight/2, 450 + p1.x - smallest - (letterWidth/2), 450 + p1.y - smallesty -  letterHeight/2);
        }
    }
    pop();


    image(pg, 0, 0);
    count++;
  }


  function temp(){
    for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        const p1 = pts[i-1];
        if (abs(p.x - p1.x) < 20){
            line(p.x + xOffset, p.y + yOffset, p1.x + xOffset, p1.y + yOffset);
        }
        point(p.x + xOffset, p.y + yOffset);
    }
  }

  function rotatepoint(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}