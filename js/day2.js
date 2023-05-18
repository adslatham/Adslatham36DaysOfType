let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let check = 0;
let squares = [];
let movingSquares = [];
let nextSqPositions = [];
let letterHeight, letterWidth;

var range = 1200;

function preload() {
  font = loadFont("36DaysOfType.otf");
  img = loadImage("assets/Spot.png");
}

function setup() {
  count = 0;
  createCanvas(900, 900);
  opentype.load('36DaysOfType.otf', function (err, f) {
    if (err) {
        alert('Font could not be loaded: ' + err);
    } else {
        font = f
        console.log('font ready')

        fSize = 900
        msg = '2'

        let x = 60
        let y = 300
        path = font.getPath(msg, x, y, fSize)
        console.log(path.commands)

        strokeWeight(5);

        largest = -10000;
        largesty = -10000;
        smallest = 10000;
        smallesty = 10000;
    
        for (let cmd of path.commands) {
            if (typeof cmd.x !== "undefined"){
              if (cmd.x > largest){
                  largest = cmd.x;
              }
              if (cmd.x < smallest){
                  smallest = cmd.x;
              }
            }
            if (typeof cmd.y !== "undefined"){
              if (cmd.y > largesty){
                  largesty = cmd.y;
              }

              if (cmd.y < smallesty){
                  smallesty = cmd.y;
              }
            }
        }

        letterWidth = largest-smallest;
        letterHeight = largesty-smallesty;

        let square = [];
        squares = [[],[],[],[]];
        movingSquares = [[],[],[],[]];
        nextSqPositions = [[],[],[],[]];

        for (let cmd of path.commands) {
          if (cmd.type != "Z"){
            square.push(cmd);
          }else{
            for (var p = 0; p < 4; p++){
              squares[p].push(square);
              movingSquares[p].push(square);
              nextSqPositions[p].push(square);
            }
            square = [];
          }       
        }
        //console.log(squares);
    }
});
}

function draw() {
  background(0);
  noStroke();
  fill(255,255,255,125);
  translate(450,450);

  for(var b = 0; b < squares.length; b++){
    fill(b*(255/3),150)
    for (var s = 0; s < squares[b].length; s++){
      beginShape();
      for (var p = 0; p < squares[b][s].length; p++){
        let c = max(0,count-((0.02*(b*s/2))*sin(count*PI)))

        let posx = lerp(movingSquares[b][s][p].x, nextSqPositions[b][s][p].x, easeInOutBack(c));
        let posy = lerp(movingSquares[b][s][p].y, nextSqPositions[b][s][p].y, easeInOutBack(c));          

        let noiseShake = ((noise(b+s)*200)-100)*easeInOutBack(sin(c*PI));
        let noiseyShake = ((noise(b*s)*200)-100)*easeInOutBack(sin(c*PI));

        vertex(posx + noiseShake - smallest - letterWidth/2, posy - smallesty - letterHeight/2 + noiseyShake);
      }
      endShape();
    }
  }

  
  if (count % 1 < 0.01 && check < 5){
    check += 0.1;
    if (check > 5){
      check = -1;
      count = 0;
      for(var s = 0; s < 4; s++){
        nextSqPositions[s] = shuffle(nextSqPositions[s]);
      }
      count += 0.01;
    }
  }else{
    count += 0.01;
  }
}

function rotatepoint(cx, cy, radius, angle) {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * radius + sin * radius + cx,
    ny = cos * radius - sin * radius + cy;
  return [nx, ny];
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}