let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let count =0;
let mcount = 0;
let masterCount = 0;
let shadow;
let boxes = [];
let pg;
let maskpg;
let border;

function setup() {
    createCanvas(720, 1280);
    pg = createGraphics(720,1280);
    maskpg = createGraphics(720,1280);
    border = createGraphics(720,1280);
    opentype.load('36DaysOfType.otf', function (err, f) {
      if (err) {
          alert('Font could not be loaded: ' + err);
      } else {
          font = f
          console.log('font ready')

          fSize = 200
          msg = '5'

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
              if (cmd.x < smallest){
                  smallest = cmd.x;
              }
              if (cmd.y > largesty){
                  largesty = cmd.y;
              }
              if (cmd.y < smallesty){
                  smallesty = cmd.y;
              }
          }
      
          letterWidth = largest-smallest;
          letterHeight = largesty-smallesty;

          console.log(path);
          pg.background(20);
      }
  });
}

  function draw() {
    background(20);
    pg.background(20,40);
    pg.push();
    pg.translate(360+sin(count/50)*100,640+sin(mcount/35)*200)
    pg.rotate(count/50)
    for (let s = 0; s < 10; s++){
      pg.rotate(s/50 - count/300)
      for (let r = 0; r < 360; r+=(40 - (6*s)/2)){
        pg.fill(noise((count+r)/150)*255);
        //pg.stroke((1-(noise((count+r)/150)))*255);
        pg.strokeWeight(2);
        pg.stroke(60);
        pg.push();
        var rPoint = pointOnCircle(0,0,(10+(s*7))*s,r)
        pg.translate(rPoint[0], rPoint[1]);
        pg.rotate((r + 90) * (Math.PI / 180));
        pg.scale(0.08*pow(s+1, 1.4) * (0.5+(0.5+sin(count/100))/5))
        for (let cmd of path.commands) {
          if (cmd.type == "M"){
            pg.beginShape();
          }
          if (cmd.type != "Z"){
            pg.vertex(cmd.x - smallest - (letterWidth/2), cmd.y - smallesty -  (letterHeight/2))
          }else{
            pg.vertex(path.commands[0].x - smallest - (letterWidth/2), path.commands[0].y - smallesty -  (letterHeight/2))
            pg.endShape();
          }
        }
        pg.pop();
      }
    }
    pg.pop();

    maskpg.clear();
    maskpg.push();
    maskpg.fill(255);
    maskpg.translate(450,450)
    maskpg.scale(5);
    maskpg.beginShape();
    let k = 0;
    let p = 0;
    let noiseMove = 50;
    for (let cmd of path.commands) {
      maskpg.vertex(cmd.x - smallest - (letterWidth/2) + (noise(k + count/150)*noiseMove)-(noiseMove/2), cmd.y - smallesty -  letterHeight/2  + (noise(p + count/150)*noiseMove)-(noiseMove/2));
      k+= 0.05
      p+= 0.08

    }
    maskpg.endShape();
    maskpg.pop();

    border.clear();
    border.noFill();
    for (let e = 0; e < 9; e++){
      border.stroke(100 + (e*25.5));
      border.push();
      border.translate(450,450)
      if (e < 8){
        border.scale(1 + (e/2) + (sin(e+mcount/50))/2);
        border.strokeWeight(1)
      }else{
        border.scale(5);
        border.strokeWeight(3)
      }
      border.beginShape();
      k = 0;
      p = 0;
      for (let cmd of path.commands) {
        border.vertex(cmd.x - smallest - (letterWidth/2) + (noise(k + count/150)*noiseMove)-(noiseMove/2), cmd.y - smallesty -  letterHeight/2  + (noise(p + count/150)*noiseMove)-(noiseMove/2));
        k+= 0.05
        p+= 0.08
        if (cmd.type == "Z"){
          pg.vertex(path.commands[0].x - smallest - (letterWidth/2)+ (noise(0 + count/150)*noiseMove)-(noiseMove/2), path.commands[0].y - smallesty -  (letterHeight/2)+ (noise(0 + count/150)*noiseMove)-(noiseMove/2))
        }
      }
      border.endShape();
      border.pop();
    }

    var fives = pg.get();
    fives.mask(maskpg);
    image(pg,0,0)
    //image(fives, 0, 0);
    //image(maskpg, 0, 0);
    count++;
    mcount+=1.2;
  }

  function pointOnCircle(cx, cy, radius, angle) {
    var radians = (Math.PI / 180) * angle,
        px = Math.cos(radians)*radius + cx,
        py = Math.sin(radians)*radius + cy;
    return [px, py];
  }