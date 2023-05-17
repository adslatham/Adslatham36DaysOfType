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
    msg = '3'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.05, // increase for more points
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

    for (let k = 1; k < 10; k++){
        translate((sin(k + count/2)*10), 0);
        for (let p = 0; p < pts.length; p++){
            push();
            fill((255/(10-k))+((k*20)*(sin((k/PI) + count/5)+0.5)));
            scale(0.2+(k*0.1));
            translate(pts[p].x - smallest - (letterWidth/2), pts[p].y - smallesty -  letterHeight/2);
            rotate(((pts[p].x + pts[p].y)/250) + count + k/2 + sin(easeInOutQuad(pts[p].count)*PI)*TWO_PI)
            var scaleFactor = ((sin(easeInOutQuad(pts[p].count)*PI)+0.5)/2)
            ellipse(0,0, noise(pts[p].x + count/2, count/2)*100*scaleFactor+10, noise(pts[p].x + count / 10, count/2 )*5*scaleFactor+5)
            pop();

            if (k == 4){
                if (pts[p].count >= 1){
                    if (pts[p].hold > 50){
                        pts[p].count = 0;
                        pts[p].hold = 0;
                    }else{
                        pts[p].hold++;
                    }
                }else{
                    pts[p].count+= 0.01;
                }
            }
        }
    }

    count+=0.1;
  }
