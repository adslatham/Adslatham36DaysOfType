let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let randomPts = []; // store path data
let count = 0;
let fcount = 0;
let lines = [];
let letterWidth, letterHeight, smallest, smallesty, largest, largesty;
let high = 1;
let low = 0;
let range = 1;

function preload() {
    font = loadFont('36DaysOfType.otf')
    img = loadImage('assets/Spot.png');
}

function setup() {
    createCanvas(900, 900);
    fSize = 900;
    textFont(font);
    textSize(fSize);
    msg = '9'
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.25, // increase for more points
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

    for (let i = 0; i < 900; i+=0){
        var randomXn = random(smallest,largest);
        var randomYn = random(smallesty,largesty);
        if (inside([randomXn, randomYn], pts)){
            randomPts.push({point:[randomXn - smallest - (letterWidth/2), randomYn - smallesty -  letterHeight/2], pointSize: random(2, 10), randomX:i*0.03, randomY:random(-1000,1000)})
            i++;
        }
    }
    getNoiseLimits()
}

function draw() {
    background(0,100);
    stroke(255);
    strokeWeight(0);
    translate(450,450)

    for (var i = 0; i < randomPts.length; i++){
        var factor = easeInOutExpo(max(0,sin(fcount)))
        var tfactor = easeInOutExpo(max(0,sin(fcount-(i*0.0005))))
        var tNoise = (noise(sin(randomPts[i].randomX + count/300, count/150)));
        var transformedTNoise = ((((tNoise-low)/range)*700)-350);
        var tNoisey = (noise(sin(randomPts[i].randomX, 1-count/150)));
        var transformedtNoisey = ((((tNoisey-low)/range)*700)-350);
        fill(155+sin(randomPts[i].randomX*10 + count/50)*100)

        if (i == 0){
            //console.log(tNoise + " " + tNoisey)
            //console.log(transformedTNoise + " " + transformedtNoisey)
        }

        circle(lerp(randomPts[i].point[0],transformedTNoise, tfactor), lerp(randomPts[i].point[1], transformedtNoisey, tfactor), randomPts[i].pointSize)
    }

    count++;
    fcount+=0.01;
    if (fcount > (PI)+0.3){
        fcount = 0;
        noiseSeed(count)
        getNoiseLimits();
        console.log(high + "   " + low);
        console.log(range);
    }
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

function getNoiseLimits(){
    high = 0;
    low = 1;
    for (var i = 0; i < TWO_PI; i+=0.001){
        let num = noise(sin(i));
        if (num < low){
            low = num;
        }
        if (num > high){
            high = num;
        }
    }
    range = high-low;
}