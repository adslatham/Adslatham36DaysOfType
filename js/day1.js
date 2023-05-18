let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count =0;
let mcount = 0;
let masterCount = 0;
let shadow;
let boxes = [];
let xCount = 30;
let yCount = 30;
let fieldPts = [];

function preload() {
    font = loadFont('36DaysOfType.otf')
}

function setup() {
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = '1'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.1, // increase for more points
        simplifyThreshold: 0.0 // increase to remove collinear points
    });
    console.log(pts); // { x, y, path angle }

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

    for (let x = 0; x < xCount; x++){
      for (let y = 0; y < yCount; y++){
        fieldPts.push({
          xC:x,
          yC:y,
          xPos: x*(width/xCount),
          yPos: y*(height/yCount),
        })
      }
    }
    background(0);
  }

  function draw() {
    fill(255);
    for (let p = 0; p < fieldPts.length; p++){
      let fp = fieldPts[p];
      let theta = noise(fp.xPos*0.01 + count, fp.yPos*0.01 + count)*PI*2;
      let v = p5.Vector.fromAngle(theta, 5);
      fieldPts[p].xPos += v.x;
      fieldPts[p].yPos += v.y;
      if (fieldPts[p].xPos < 0 || fieldPts[p].xPos > 900 || fieldPts[p].yPos < 0 || fieldPts[p].yPos > 900){
        fieldPts[p].yPos = random(0,900);
        fieldPts[p].xPos = 900;
      }
      if (inside([fieldPts[p].xPos, fieldPts[p].yPos], pts)){
        stroke(20);
        fill(255); 
      }else{
        stroke(1-noise(fieldPts[p].xPos/80 + count, fieldPts[p].yPos/80 + count)*255);
        fill(noise(fieldPts[p].xPos/80 + count, fieldPts[p].yPos/80 + count)*255);
        //fill(80);
      }

      circle(fieldPts[p].xPos, fieldPts[p].yPos, 10);
    }

    for (let p = 0; p < pts.length; p++){
      var pRot = rotatepoint((smallest + largest) / 2, (smallesty + largesty) /2, pts[p].x, pts[p].y, sin(count/80)*0.1)
      pts[p].x = pRot[0];
      pts[p].y = pRot[1];

    }

    count+=0.05;

    /*
    if ((round(count*100)/100) % 20 == 0){
      background(20);
    }
    */
  }

  function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = 450 + vs[i].x - smallest - (letterWidth/2), yi = 450 + vs[i].y - smallesty -  letterHeight/2;
        var xj = 450 + vs[j].x - smallest - (letterWidth/2), yj = 450 + vs[j].y - smallesty -  letterHeight/2;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
  };

  function rotatepoint(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
  }