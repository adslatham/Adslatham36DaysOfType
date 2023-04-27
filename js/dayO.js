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
    msg = 'o'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.5, // increase for more points
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

    let stage = 0;

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      let p1;
      if (i > 0){
          p1 = pts[i-1];
      }else{
          p1 = pts[pts.length-1];
      }
      if (abs(p1.x - p.x) < 5 && i != 0){
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


        
    background(20);
  }

  function draw() {
    let radius = 500;

    pg.noStroke();

    let x1 = 450 + (Math.cos(degreesToRadians(90 + (count*30))) * radius);
    let y1 = 450 + (Math.sin(degreesToRadians(90 + (count*30))) * radius);
    let x2 = 450 + (Math.cos(degreesToRadians(270 + (count*30))) * radius);
    let y2 = 450 + (Math.sin(degreesToRadians(270 + (count*30))) * radius);
    
    g = drawingContext.createLinearGradient(x1,y1,x2,y2);
    let c1 = color(50, 50, 50);
    let c2 = color(255,255,255);
    g.addColorStop(0,   c1.toString());
    g.addColorStop(0.5, c2.toString());
    g.addColorStop(1,   c1.toString());


    background(20);
    pg.background(20);

    pg.fill(80);

    pg.beginShape();

    let size = 50 * noise(count);
    let dip = max (0, 180 * sin(count));
    let sinMult1 = max (0, 120 * sin(count));
    let sinMult2 =  max (0, 50 * sin(count));


    for (let i = 1; i < outerPoints.length; i++) {
      let p = outerPoints[i];
      pg.vertex(450 + p.x - smallest - (letterWidth/2) + sin(count/3)*20, 450 + p.y - smallesty -  letterHeight/2 + (sin((p.x/5) - count + PI)*sinMult1 + (noise((p.x/size) - count)-0.5)*dip) * ((p.y - smallesty) / letterHeight) + sin(count/1.5)*20);
    }
    pg.endShape();

    pg.beginShape();
    pg.erase();
    for (let i = 0; i < innerPoints.length; i++) {
      let p = innerPoints[i];
        pg.vertex(450 + p.x - smallest - (letterWidth/2) + sin(count/3)*20, 450 + p.y - smallesty -  letterHeight/2 + (sin((p.x/5) - count + PI)*sinMult1 + (noise((p.x/size) - count)-0.5)*dip) * ((p.y - smallesty) / letterHeight) + sin(count/1.5)*20);
    }
    pg.endShape();
    pg.noErase();

    image(pg, 0, 0);
    
    pg.fill(120);

    pg.beginShape();
    for (let i = 1; i < outerPoints.length; i++) {
      let p = outerPoints[i];
      pg.vertex(450 + p.x - smallest - (letterWidth/2) + sin(count)*20, 450 + p.y - smallesty -  letterHeight/2 + (sin((p.x/5) - count + PI)*sinMult1 + (noise((p.x/size) - count)-0.5)*dip) * ((p.y - smallesty) / letterHeight) + sin(count/2)*20);
    }
    pg.endShape();

    pg.beginShape();
    pg.erase();
    for (let i = 0; i < innerPoints.length; i++) {
      let p = innerPoints[i];
        pg.vertex(450 + p.x - smallest - (letterWidth/2) + sin(count)*20, 450 + p.y - smallesty -  letterHeight/2 + (sin((p.x/5) - count + PI)*sinMult1 + (noise((p.x/size) - count)-0.5)*dip) * ((p.y - smallesty) / letterHeight) + sin(count/2)*20);
    }
    pg.endShape();
    pg.noErase();

    image(pg, 0, 0);

    pg.drawingContext.fillStyle = g;

    pg.beginShape();

    for (let i = 1; i < outerPoints.length; i++) {
      let p = outerPoints[i];
      pg.vertex(450 + p.x - smallest - (letterWidth/2), (450 + p.y - smallesty -  letterHeight/2) + (sin((p.x/5) - count)*sinMult2 + (noise((p.x/size) - count)-0.5)*dip) * ((p.y - smallesty) / letterHeight));
    }
    pg.endShape();

    pg.beginShape();
    pg.erase();
    for (let i = 0; i < innerPoints.length; i++) {
      let p = innerPoints[i];
        pg.vertex(450 + p.x - smallest - (letterWidth/2), 450 + p.y - smallesty -  letterHeight/2 + (sin((p.x/5) - count)*sinMult2 + (noise((p.x/size) - count)-0.5)*dip) * ((p.y - smallesty) / letterHeight));
    }
    pg.endShape();
    pg.noErase();

    image(pg, 0, 0);

    count+=0.025;

    console.log(sin(count)*50);
  }

  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }