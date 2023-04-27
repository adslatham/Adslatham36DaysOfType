let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count =0;
let mcount = 0;
let masterCount = 0;
let shadow;
let lines = [];
let boxes = [];

function preload() {
    font = loadFont('36DaysOfType.otf')
}

function setup() {
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = 'n'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.02, // increase for more points
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

    lines = [];
    boxes = [];

    for (let i = 0; i < pts.length; i++) {
      var target = min(max(0, round(random(i - 5, i + 5))), pts.length-1);
      lines.push({x:pts[i].x, y:pts[i].y, progress:random(0,1), tx:pts[target].x, ty:pts[target].y})
    }

    for (let x = 0; x <= 900; x += 90) {
      for(let y = 0; y <= 900; y += 90){
        var targetx = min(max(-90, box.x + round(random(-1,1))*90), 990);
        var targety = min(max(-90, box.y + round(random(-1,1))*90), 990);
        boxes.push({x:x, y:y, progress:random(0,1), tx:targetx, ty:targety})
      }

    }

    background(20);
  }

  function draw() {
    background(20,5);
    stroke(50);
    strokeWeight(5);

    for(let p = 0; p < boxes.length; p++){
      point(boxes[p].x+45, boxes[p].y+45);
    }

    for(let l = 0; l < boxes.length; l++){
      var box = boxes[l];
      if (box.progress > 0.99){
        var targetx = min(max(-90, box.x + round(random(-1,1))*90), 990);
        var targety = min(max(-90, box.y + round(random(-1,1))*90), 990);
        boxes[l].tx = targetx;
        boxes[l].ty = targety;
        boxes[l].progress = 0;
      }
      point(lerp(box.x, box.tx, easeInOutQuad(box.progress))+45, lerp(box.y, box.ty, easeInOutQuad(box.progress))+45);
      
      boxes[l].progress = boxes[l].progress + 0.005;
    }

    stroke(255);
    strokeWeight(5);

    for(let p = 0; p < pts.length; p++){
      point(450 + pts[p].x - smallest - (letterWidth/2), 450 + pts[p].y - smallesty -  letterHeight/2);
    }

    for(let l = 0; l < lines.length; l++){
      var line = lines[l];
      if (line.progress > 0.99){
        var target = min(max(0, round(random(l - 5, l + 5))), pts.length-1);
        lines[l].tx = pts[target].x;
        lines[l].ty = pts[target].y;
        lines[l].progress = 0;
      }
      if (l == 0){
        console.log(line.x + " " + line.tx);
      }
      point(450 + lerp(line.x, line.tx, easeInOutQuad(line.progress)) - smallest - (letterWidth/2), 450 + lerp(line.y, line.ty, easeInOutQuad(line.progress)) - smallesty -  letterHeight/2);
      
      lines[l].progress = lines[l].progress + 0.01;
    }
  }

  function lerp (start, end, amt){
    return (1-amt)*start+amt*end
  }