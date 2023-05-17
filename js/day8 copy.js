let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
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
        sampleFactor: 0.1, // increase for more points
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

    var numberOfLines = 40;

    for (var j = 1; j < numberOfLines+1; j++){
        lines.push({
            xPos: j*(900/numberOfLines)
        })
    }
}

function draw() {
    background(0,50);
    stroke(155);
    fill(50);
    strokeWeight(1);
    //noStroke();

    for (let p = 0; p < pts.length; p++){
        //circle(450 + pts[p].x  - smallest - (letterWidth/2), 450 + pts[p].y- smallesty -  letterHeight/2, 5)
    }

    for (let l = 0; l < lines.length; l++){
        for (let y = 0; y < 900; y+=12){
            var nDistance = getNearestDistance(lines[l].xPos, y);
            var tDist = max(0, 20-nDistance);
            stroke(55 + 200*(tDist/20));
            strokeWeight(1 + 5*(tDist/20));
            var n = ((noise(lines[l].xPos/500, y + count)*100)-50)*(tDist/20);
            var ny = ((noise(y + count, lines[l].xPos/500)*100)-50)*(tDist/20);
            line(lines[l].xPos + tDist + n, y + ny, lines[l].xPos - tDist + n, y + 20 + ny);
        }
        lines[l].xPos-=1;
        if (lines[l].xPos < 0){
            lines[l].xPos = 900
        }
    }
    

    count+=0.01;
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