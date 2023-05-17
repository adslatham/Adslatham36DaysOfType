let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;

function preload() {
    font = loadFont('36DaysOfType.otf')
    img = loadImage('assets/Spot.png');
}

function setup() {
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = '6'
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
        pts[i].count = (i/pts.length);
        pts[i].hold = 0;
    }

    letterWidth = largest-smallest;
    letterHeight = largesty-smallesty;
    
  }

  function draw() {
    background(0);
    translate(450,450);
    noStroke();
    //fill(255);

    for (let p = floor(pts.length/2); p > 2; p--){
        push();
        //fill(255);
        scale(1.4);
        translate(pts[p].x - smallest - (letterWidth/2), pts[p].y - smallesty -  letterHeight/2);
        rotate(((pts[p].x + pts[p].y)/250) + count/2 + sin(easeInOutQuad(pts[p].count/100)*PI)*TWO_PI)
        var scaleFactor = ((sin(easeInOutQuad(pts[p].count)*PI)+0.5)/2)
        var boxheight = max(20, (0.5+(sin(pts[p].x/100 + pts[p].count))*30))

        for(var i = 0; i < boxheight; i+=4){
            fill(100+(noise(p/100)*(i/boxheight))*155);
            rect(-boxheight/2 + i,-boxheight/2, 4, boxheight)
        }
        pop();

        pts[p].count+=((0.5+(sin(p*0.1 + count/10)/10))*0.2);
    }

    count+=0.1;
  }
