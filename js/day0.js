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
let innerPoints = [];
let outerPoints = [];
let circles = [];
let pg;
let gradient;
let g;

function preload() {
    font = loadFont('36DaysOfType.otf')
}

function setup() {
    createCanvas(900, 900);
    pg = createGraphics(900,900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = '0'
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

    for (let i = 0; i < 360; i+=2){
      let theta = degreesToRadians(i);
      let x1 = 0+(450*cos(theta));
      let y1 = 0+(450*sin(theta));
      circles.push([x1,y1]);
    }

    let stage = 0;

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      let p1;
      if (i > 0){
          p1 = pts[i-1];
      }else{
          p1 = pts[pts.length-1];
      }
      if (abs(p1.x - p.x) < 10 && i != 0){
          if (stage > 0){
            outerPoints.push(p);
          }else{
            innerPoints.push(p);
          }
      }else{
        if (i != 0){
          if (stage == 0){
            outerPoints.push(p);
            stage++;
          }
        }
      }
    }
  
  }

  function draw() {
    background(20);
    stroke(80);
    strokeWeight(2);
    fill(150);
    translate(450,450);
    for (let c = 0; c < circles.length; c++){
      circle(circles[c][0], circles[c][1], 1);

      let theta = degreesToRadians((c*2)+(count*10));
      let x1 = 0+(450*cos(theta));
      let y1 = 0+(450*sin(theta));
      circles[c] = [x1,y1];
    }

    for (let p = 0; p < pts.length; p++){
      var xp1 = pts[p].x - smallest - (letterWidth/2);
      var yp1 = pts[p].y - smallesty - (letterHeight/2);

      xp1 = xp1 * (0.5+(1+sin(count/5))/2)
      yp1 = yp1 * (0.5+(1+sin(count/2))/2)
      
      var localPoint = rotatepoint(0,0,xp1,yp1,count*10);
      
      //var points = getNearestPositions(localPoint);
      var point = getRandomCirclePoint(p);

      //console.log(point);

      stroke(80);
      line(localPoint[0], localPoint[1], point[0], point[1]);

    }

    for (let p = 1; p < innerPoints.length; p++){
      var xp1 = innerPoints[p-1].x - smallest - (letterWidth/2);
      var yp1 = innerPoints[p-1].y - smallesty - (letterHeight/2);
      var xp2 = innerPoints[p].x - smallest - (letterWidth/2);
      var yp2 = innerPoints[p].y - smallesty - (letterHeight/2);

      xp1 = xp1 * (0.5+(1+sin(count/5))/2)
      yp1 = yp1 * (0.5+(1+sin(count/2))/2)
      xp2 = xp2 * (0.5+(1+sin(count/5))/2)
      yp2 = yp2 * (0.5+(1+sin(count/2))/2)
      
      var localPoint = rotatepoint(0,0,xp1,yp1,count*10);
      var localPoint2 = rotatepoint(0,0,xp2,yp2,count*10);
      stroke(255);
      //circle(localPoint[0], localPoint[1], 3);
      line(localPoint[0], localPoint[1], localPoint2[0], localPoint2[1])
      if (p == innerPoints.length-1){
        var xp0 = innerPoints[0].x - smallest - (letterWidth/2);
        var yp0 = innerPoints[0].y - smallesty - (letterHeight/2);
        xp0 = xp0 * (0.5+(1+sin(count/5))/2)
        yp0 = yp0 * (0.5+(1+sin(count/2))/2)
        var localPoint0 = rotatepoint(0,0,xp0,yp0,count*10);
        line(localPoint[0], localPoint[1], localPoint0[0], localPoint0[1])
      }
    }
    for (let p = 1; p < outerPoints.length; p++){
      var xp1 = outerPoints[p-1].x - smallest - (letterWidth/2);
      var yp1 = outerPoints[p-1].y - smallesty - (letterHeight/2);
      var xp2 = outerPoints[p].x - smallest - (letterWidth/2);
      var yp2 = outerPoints[p].y - smallesty - (letterHeight/2);

      xp1 = xp1 * (0.5+(1+sin(count/5))/2)
      yp1 = yp1 * (0.5+(1+sin(count/2))/2)
      xp2 = xp2 * (0.5+(1+sin(count/5))/2)
      yp2 = yp2 * (0.5+(1+sin(count/2))/2)
      
      var localPoint = rotatepoint(0,0,xp1,yp1,count*10);
      var localPoint2 = rotatepoint(0,0,xp2,yp2,count*10);
      stroke(255);
      //circle(localPoint[0], localPoint[1], 3);
      line(localPoint[0], localPoint[1], localPoint2[0], localPoint2[1])
      if (p == outerPoints.length-1){
        var xp0 = outerPoints[0].x - smallest - (letterWidth/2);
        var yp0 = outerPoints[0].y - smallesty - (letterHeight/2);
        xp0 = xp0 * (0.5+(1+sin(count/5))/2)
        yp0 = yp0 * (0.5+(1+sin(count/2))/2)
        var localPoint0 = rotatepoint(0,0,xp0,yp0,count*10);
        line(localPoint2[0], localPoint2[1], localPoint0[0], localPoint0[1])
      }
    }

    count+=0.1;
    //noLoop();
  }

  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  function getNearestPositions(pos){
    var dist = [1000000,1000000,1000000,1000000];
    var outs = [];
    for (let c = 0; c < circles.length; c++){
      let xSize = abs(circles[c][0] - pos[0])
      let ySize = abs(circles[c][1] - pos[1])
      if (xSize + ySize < dist[0]){
        outs[3] = outs[2];
        outs[2] = outs[1];
        outs[1] = outs[0];
        outs[0] = circles[c];
        dist[3] = dist[2]
        dist[2] = dist[1]
        dist[1] = dist[0]
        dist[0] = xSize + ySize;
      }
      else if (xSize + ySize < dist[1]){
        outs[3] = outs[2];
        outs[2] = outs[1];
        outs[1] = circles[c];
        dist[3] = dist[2]
        dist[2] = dist[1]
        dist[1] = xSize + ySize
      }
      else if (xSize + ySize < dist[2]){
        outs[3] = outs[2];
        outs[2] = circles[c];
        dist[3] = dist[2]
        dist[2] = xSize + ySize
      }
      else if (xSize + ySize < dist[3]){
        outs[3] = circles[c];
        dist[3] = xSize + ySize
      }
    }
    return outs;
  }

  function getRandomCirclePoint(a){
    //var ind = floor(random(0, circles.length));
    //console.log((1+(sin(a + count))/2))
    var ind = floor((0.5+(sin((a/50) + (count/10000)))/2)*(circles.length-1));
    return circles[ind];
  }

  function rotatepoint(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
  }