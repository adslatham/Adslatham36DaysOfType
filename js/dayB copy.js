let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let path;
let count = 0;
let largest, smallest, letterWidth, letterHeight;

function setup() {
    createCanvas(900, 900);

    opentype.load('36DaysOfType.otf', function (err, f) {
        if (err) {
            alert('Font could not be loaded: ' + err);
        } else {
            font = f
            console.log('font ready')

            fSize = 900
            msg = 'b'

            let x = 60
            let y = 300
            path = font.getPath(msg, x, y, fSize)
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

  function draw(){
    background(0);
    stroke(255);
    strokeWeight(2);
    noFill();
    translate(-30,380)

    for (let cmd of path.commands) {
        if (cmd.type === 'M') {
            line(cmd.x , cmd.y)
        } else if (cmd.type === 'L') {
            vertex(cmd.x, cmd.y)
        } else if (cmd.type === 'C') {
            bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
        } else if (cmd.type === 'Q') {
            quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y)
        } else if (cmd.type === 'Z') {
            endShape();
            i++;
        }
    }

    for (let cmd of path.commands) {
        if (cmd.type === 'M') {
            beginShape()
            vertex(cmd.x , cmd.y)
        } else if (cmd.type === 'L') {
            vertex(cmd.x, cmd.y)
        } else if (cmd.type === 'C') {
            bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
        } else if (cmd.type === 'Q') {
            quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y)
        } else if (cmd.type === 'Z') {
            endShape();
            i++;
        }
    }

    let pg = createGraphics(900,900);
    pg.fill(0);
    pg.translate(-30,380);

    var i = 0;

    for (let cmd of path.commands) {
        if (cmd.type === 'M') {
            if (i == 1){
                pg.beginShape()
                pg.vertex(cmd.x , cmd.y)
            }
        } else if (cmd.type === 'L') {
            if (i == 1)
                pg.vertex(cmd.x, cmd.y)
        } else if (cmd.type === 'C') {
            if (i == 1)
                pg.bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
        } else if (cmd.type === 'Q') {
            if (i == 1)
                pg.quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y)
        } else if (cmd.type === 'Z') {
            if (i == 1)
                pg.endShape();
            i++;
        }
    }
    i = 0;
    pg.erase();
    for (let cmd of path.commands) {
        if (i < 1){
            if (cmd.type === 'M') {
                pg.beginShape()
                pg.vertex(cmd.x , cmd.y)
            } else if (cmd.type === 'L') {
                pg.vertex(cmd.x, cmd.y)
            } else if (cmd.type === 'C') {
                pg.bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
            } else if (cmd.type === 'Q') {
                pg.quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y)
            } else if (cmd.type === 'Z') {
                pg.endShape();
                i++;
            }
        }
    }

    let pgImage = pg.get();

    translate(-30,380);

    image(pgImage, 0, 0);


  }


  function olddraw() {
    background(0);
    push();


    for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        const p1 = pts[i-1];
        stroke(255);
        if (abs(p.x - p1.x) < 50){
            line(p.x - smallest - letterWidth/2, p.y - smallesty- letterHeight/2, p1.x  - smallest- letterWidth/2, p1.y - smallesty - letterHeight/2);
            line(p.x - smallest - letterWidth/2, p.y - smallesty- letterHeight/2, (p.x  - smallest - letterWidth/2)*10, (p.y - smallesty - letterHeight/2)*10);
        }
    }
    pop();
    noStroke();
    translate(width / 2, height / 2);
    fill(0);
    beginShape();
    for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        const p1 = pts[i-1];
        vertex(p.x - smallest - letterWidth/2, p.y - smallesty- letterHeight/2);
    }
    endShape(CLOSE);

    count++;
  }
