let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let fcount = 0;
let lines = [];
let letterWidth, letterHeight, smallest, smallesty, largest, largesty;

function preload() {
    font = loadFont('36DaysOfType.otf')
    img = loadImage('assets/Spot.png');
}

function setup() {
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = '8'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.25, // increase for more points
        simplifyThreshold: 0.0 // increase to remove collinear points
    });
    console.log(pts); // { x, y, path angle }

    //stroke(255);
    //strokeWeight(8);

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
    stroke(155,80);
    strokeWeight(2)
    translate(450,450)
    scale(1+sin(count)*0.1)

    var circPoint = pointOnCircle(0,0,150+300*(1+sin(count/2)), count*120)
    for (let p = 0; p < pts.length; p++){
        var fNoise = noise(pts[p].x/100 + count*5)*180;
        //stroke(fNoise);
        var xNoise = (noise(pts[p].x/250 + count/2)*100)-50;
        var yNoise = (noise(pts[p].y/250 + count/2)*100)-50;
        line(pts[p].x + xNoise - smallest -(letterWidth/2), pts[p].y + yNoise - smallesty -  letterHeight/2, circPoint[0], circPoint[1])
    }

    for (let p = 0; p < pts.length; p++){
        fill(180);
        noStroke();
        var xNoise = (noise(pts[p].x/250 + count/2)*100)-50;
        var yNoise = (noise(pts[p].y/250 + count/2)*100)-50;
        //circle(pts[p].x + xNoise - smallest - (letterWidth/2), pts[p].y + yNoise - smallesty -  letterHeight/2, (max(0,sin(count*2))*3))
    }
    

    count+=easeInOutExpo(1+sin(fcount))/50;
    fcount+=0.01;
    if (fcount > PI){
        fcount = 0;
    }
}

function getNearestDistance(px,py){
    var dist = 100000;
    for (let p = 0; p < pts.length; p++){
        let d = getDistanceBetweenPoints(px, py, 450 + pts[p].x - smallest - (letterWidth/2), 450 + pts[p].y - smallesty -  letterHeight/2);
        if (d < dist){
            dist = d;
        }
    }
    return dist;
}

function pointOnCircle(cx, cy, radius, angle) {
    var radians = (Math.PI / 180) * angle,
        px = Math.cos(radians)*radius + cx,
        py = Math.sin(radians)*radius + cy;
    return [px, py];
}

function getDistanceBetweenPoints(x1,y1,x2,y2){
    let x = x1 - x2;
    let y = y1 - y2;
    return sqrt(x * x + y * y);
}