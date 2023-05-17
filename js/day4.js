let font;
let fSize; // font size
let lines = [];
let count = 0;
let mcount = 0;

function preload() {
    font = loadFont('36DaysOfType.otf')
}
function setup() {
    count = 0;
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = "4";
    pts = font.textToPoints(msg, 0, 0, fSize, {
      sampleFactor: 0.2 , // increase for more points
      simplifyThreshold: 0.0, // increase to remove collinear points
    });

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
        let r = random(0,255);
        pts[i].color = [r , r , r]
        pts[i].count = (i/pts.length);
        pts[i].hold = 0;
    }

    letterWidth = largest-smallest;
    letterHeight = largesty-smallesty;
    
  }

  var noiseSize = 800;

  function draw() {
    var spacing = window.innerHeight/7;
    background(0);
    translate(450,450);
    scale(1+(sin(count/50)*0.3));
    noStroke();
    var defSize = 0.02;

    console.log(((1+sin(count/50))/2));
    var mouseThreshold = max(100,300*((1+sin(count/50))/2));    

    var mPoint = pointOnCircle(450,450 + sin(count/10)*150, noise(count/80)*400, count*3);

    for (let r = 0; r < 5; r++){
        scale(1 - r*0.08*(sin(count/50)))
        var noiseX = (noise(r+(count/150))*10)-5;
        var noiseY = (noise((r/10)+(count/80))*10)-5;
        translate(noiseX, noiseY);

        //var down = spacing*((r*4))+100;

        for (let p = 0; p < pts.length; p++){
            push();

            var dist = 1-(easeInOutQuad(min(mouseThreshold, getDistanceBetweenPoints(mPoint[0]-450, mPoint[1]-450, pts[p].x - smallest - (letterWidth/2), pts[p].y - smallesty -  (letterHeight/2)))/mouseThreshold));
            var tNoiseX = ((noise(pts[p].x+(count/100))*noiseSize)-(noiseSize/2))*(defSize+(dist*(1-defSize)));
            var tNoiseY = ((noise(pts[p].y+(count/100))*noiseSize)-(noiseSize/2))*(defSize+(dist*(1-defSize)));

            translate(pts[p].x - smallest - (letterWidth/2) + tNoiseX, pts[p].y - smallesty -  letterHeight/2 + tNoiseY);
            fill(lerp(pts[p].color[0], 55+(r*(50)), (1-dist)), lerp(pts[p].color[1], 55+(r*(50)), (1-dist)), lerp(pts[p].color[2], 55+(r*(50)), (1-dist)))
            rotate(noise(((p*r)/50)+count/80)*TWO_PI);
            ellipse(0,0,2+(20-(dist*20))*sin(count/50), 2)
            pop();
        }
    }

    count+=1;
  }

  function getDistanceBetweenPoints(x1,y1,x2,y2){
    let x = x1 - x2;
    let y = y1 - y2;
    return sqrt(x * x + y * y);
  }

  function pointOnCircle(cx, cy, radius, angle) {
    var radians = (Math.PI / 180) * angle,
        px = Math.cos(radians)*radius + cx,
        py = Math.sin(radians)*radius + cy;
    return [px, py];
  }