let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let lines = [];
let newLines = [];
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
    msg = '7'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.15, // increase for more points
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

    generateNewLines(10);

    lines = lines.concat(JSON.parse(JSON.stringify(newLines)));
    newLines = [];
}

var lineLengths = 50;
var maxNumber = 2800;
var holdLength = 30;

function draw() {
    background(0);
    stroke(255);
    //translate(450,450)
    strokeWeight(5);

    let nextLines = [];
    for (var k = 0; k < lines.length; k++){
        stroke(255*((holdLength-lines[k].hold)/holdLength), 150);
        stroke(lines[k].color[0], lines[k].color[1], lines[k].color[2], 150*((holdLength-lines[k].hold)/holdLength));
        var lerpX = lerp(lines[k].start[0],lines[k].end[0], lines[k].lineLength/lines[k].totLength);
        var lerpY = lerp(lines[k].start[1],lines[k].end[1], lines[k].lineLength/lines[k].totLength);       
        line(lines[k].start[0], lines[k].start[1], lerpX, lerpY);
        if (lines[k].lineLength < lines[k].totLength){
            lines[k].lineLength += 5;
            nextLines.push(JSON.parse(JSON.stringify(lines[k])));
        }
        else{
            if (lines[k].hold == 0){
                if (inside(lines[k].end, pts) && lines.length < maxNumber){
                    generateTwoNewEndLine(lines[k].end);
                    console.log(k);
                }else{
                    generateNewLines(1);
                }
            }
            if (lines[k].hold < holdLength){
                lines[k].hold++
                nextLines.push(JSON.parse(JSON.stringify(lines[k])));
            }
        }
    }

    lines = JSON.parse(JSON.stringify(nextLines));
    lines = lines.concat(JSON.parse(JSON.stringify(newLines)));
    newLines = [];

    count+=0.1;
}

function pointOnCircle(cx, cy, radius, angle) {
    var radians = (Math.PI / 180) * angle,
        px = Math.cos(radians)*radius + cx,
        py = Math.sin(radians)*radius + cy;
    return [px, py];
}

function generateNewLines(count){
    if (lines.length < maxNumber){
        var num = 0;
        do {
            var point = [random(0,900), random(0,900)];
            if (inside(point, pts)){
                var targetPoint = pointOnCircle(point[0], point[1], 25, round(random(0,8))*45);
                if (inside(targetPoint, pts)){
                    var l = {
                        start:point,
                        end:targetPoint,
                        lineLength:0,
                        hold:0,
                        totLength:random(40,80),
                        color:[0, random(0,255), random(150,255)]
                    }
                    newLines.push(l);
                    num++;
                }
            }
        }
        while (num < count);
    }
}

function generateTwoNewEndLine(ePoint){
    if (lines.length < maxNumber){
        for (var i = 0; i < 2; i++){
            let targetPoint = pointOnCircle(ePoint[0], ePoint[1], 25, round(random(0,8))*45);
            if(inside(targetPoint, pts)){
                let l = {
                    start:ePoint,
                    end:targetPoint,
                    lineLength:0,
                    hold:0,
                    totLength:random(40,80),
                    color:[0, random(0,255), random(150,255)]
                }
                newLines.push(l);
            }else{
                generateNewLines(1);
            }
        }
    }
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = 450 + vs[i].x - smallest - letterWidth/2, yi = 450 + vs[i].y - smallesty- letterHeight/2;
        var xj = 450 + vs[j].x - smallest - letterWidth/2, yj = 450 + vs[j].y - smallesty- letterHeight/2;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};