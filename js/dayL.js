let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let masterCount = 0;
let pg, pattern;
let shadow;

function preload() {
    font = loadFont('36DaysOfType.otf')
}

function setup() {
    createCanvas(900, 900);
    pattern = createGraphics(900,900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = 'l'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.3, // increase for more points
        simplifyThreshold: 0.0 // increase to remove collinear points
    });
    console.log(pts); // { x, y, path angle }

    pattern.stroke(150);
    pattern.strokeWeight(10);

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
            i = pts.length;
        }
        pg.vertex(450 + p.x - smallest - (letterWidth/2), 450 + p.y - smallesty -  letterHeight/2);
    }
    pg.endShape();   
    background(0); 
    shadow = makeShadow(pg, 10, "#111111", 1);
  }

  var gap = 15;
  var rand = 15;
  var flip = 1;

  function draw() {
    background(20,10);
    //pattern.background(0, 10);

    for(var yy = -900; yy <= 1800; yy+= rand){
      stroke(noise(yy/100)*50);
      strokeWeight(5);
      line(0, (yy + count) + ((noise((yy+count)/150)*2)-1) , 900, (yy+(900*((noise((yy+count)/150)*2)-1)) + count));
    }

    for(var yy = -900; yy <= 1800; yy+= rand){
      pattern.stroke(noise(yy/100)*255);
      pattern.strokeWeight(5);
      pattern.line(0, yy + count, 900, (yy+(900*flip) + count));
    }

    var patternb = pattern.get();
    patternb.mask(pg);

    image(shadow, (noise(masterCount*1.2)-0.5)*150, (noise(masterCount)-0.5)*150);

    image(patternb, 0, 0);

    count+=1.5;
    masterCount+=0.01;

    if (count % (gap*5) == 0){
      rand = round(random(1,10))*gap;
      if (count % (gap*15) == 0){
        count = 0;
        flip = flip == 1 ? -1 : 1;
      }
    }

  }


function makeShadow(img, sigma, shadowColor, opacity) {
  // Gaussian goes to approx. 0 at 3sigma
  // away from the mean; pad image with
  // 3sigma on all sides to give space
  const g = createGraphics(900, 900);
  
  g.imageMode(CENTER);
  g.translate(450, 450);
  //g.tint(0, 0, 0, );
  g.image(img, 0, 0);
  g.filter(BLUR, sigma);
  
  const shadow = g.get();
  const c = color(shadowColor);
  shadow.loadPixels();
  const numVals = 4 * shadow.width * shadow.height;
  for (let i = 0; i < numVals; i+=4) {
    shadow.pixels[i + 0] = c.levels[0];
    shadow.pixels[i + 1] = c.levels[1];
    shadow.pixels[i + 2] = c.levels[2];
    shadow.pixels[i + 3] *= opacity;
  }
  shadow.updatePixels();
  
  g.remove();
  return shadow;
}