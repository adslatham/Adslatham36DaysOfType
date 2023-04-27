let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count =0;
let mcount = 0;
let masterCount = 0;
let shadow;
let boxes = [];

function preload() {
    font = loadFont('36DaysOfType.otf')
}

function setup() {
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = 'm'
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

    for (let x = 0; x < 900; x+=20){
      for(let y = 0; y < 900; y+=20){
        if (inside([x,y], pts)){
          boxes.push({x:x, y:y, inside:true, rot:0, size:12});
        }else{
          boxes.push({x:x, y:y, inside:false, rot:0, size:5});
        }
      }
    }

  }

  function draw() {
    background(20);

    for (let b = 0; b < boxes.length; b++){
      push();
      if (boxes[b].inside){
        strokeWeight(1);
        stroke(0);
        fill(125 + noise((boxes[b].x/500), (boxes[b].y/500) + count)*125);
      }else{
        noStroke();
        fill(noise((boxes[b].x/500), (boxes[b].y/500) + count)*125);
      }
      translate(boxes[b].x + 8, boxes[b].y + 8)
      rotate(sin(((boxes[b].x + boxes[b].y)/250))+count);
      var size = boxes[b].size + (sin((boxes[b].x/500) + count)+0.5)*boxes[b].size;
      size = size * sin(((boxes[b].x + boxes[b].y)/1500)+count);
      if (boxes[b].inside){
        size = boxes[b].size + (sin((boxes[b].x/500) + mcount)+0.5)*boxes[b].size;
        size = size * sin(((boxes[b].x + boxes[b].y)/1500)+mcount);
      }
      square(-size/2,-size/2, size);
      pop();

    }
    count+=0.05;
    mcount+=0.02;
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