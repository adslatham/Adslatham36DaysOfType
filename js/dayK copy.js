let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count = 0;
let check = 0;

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
        msg = 'k'

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
            if (cmd.x > largest){
                largest = cmd.x;
            }
            if (cmd.x1 > largest){
                largest = cmd.x1;
            }

            if (cmd.x < smallest){
                smallest = cmd.x;
            }
            if (cmd.x1 < smallest){
                smallest = cmd.x1;
            }

            if (cmd.y > largesty){
                largesty = cmd.y;
            }
            if (cmd.y1 > largesty){
                largesty = cmd.y1;
            }

            if (cmd.y < smallesty){
                smallesty = cmd.y;
            }
            if (cmd.y1 < smallesty){
                smallesty = cmd.y1;
            }
        }
    
        letterWidth = largest-smallest;
        letterHeight = largesty-smallesty;

    }
});
}

function draw() {
  background(0);
  noStroke();
  fill(255,255,255,125);

  var offsety = 420;

  for (var k = 0; k < 4; k+=1){
    var i = 0;

    fill(k*(255/3),150)

    for (let cmd of path.commands) {
      var nx = (noise(i+count*k)-0.5)*(range*sin(i));
      var ny = (noise(i+count*k)-0.5)*(range*sin(i));
      if (cmd.type === "M" || cmd.type === "L") {
        nx = (noise(cmd.x+(i/80)+count*(k/2))-0.5)*(range*sin(count)+0.5);
        ny = (noise(cmd.y+(i/80)+count*(k/2))-0.5)*(range*sin(count)+0.5);
      }else{
        nx = (noise(cmd.x1+(i/80)+count*(k/2))-0.5)*(range*sin(count)+0.5);
        ny = (noise(cmd.y1+(i/80)+count*(k/2))-0.5)*(range*sin(count)+0.5);
      }

      nx = nx * easeInOutQuad(sin(((count%PI)*PI)/PI));
      ny = ny * easeInOutQuad(sin(((count%PI)*PI)/PI));

      if (cmd.type === 'M') {
        beginShape();
        vertex(cmd.x+nx, cmd.y+offsety+ny)
      } else if (cmd.type === 'L') {
        vertex(cmd.x+nx, cmd.y+offsety+ny)
      } else if (cmd.type === 'C') {
        bezierVertex(cmd.x1, cmd.y1+offsety+ny, cmd.x2, cmd.y2+offsety+ny, cmd.x, cmd.y+offsety+ny)
      } else if (cmd.type === 'Q') {
        quadraticVertex(cmd.x1, cmd.y1+offsety+ny, cmd.x, cmd.y+offsety+ny)
      } else if (cmd.type === 'Z') {
        endShape();
      }
      i++;
    }
  }
  
  if (count % PI < 0.01 && check < 5){
    check += 0.1;
    if (check > 5){
      check = -1;
      if (count % TWO_PI < 0.01){
        range = random(100, 300);
      }else{
        range = random(600, 900);
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