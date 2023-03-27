/*jshint esversion: 8 */

//SIMULATION VARIABLES

let x = 5; //x position of the character, detects if <0 or >10
let cooldown = 200; //ms delay between 1 step
let counter = 0; // How many seconds have passed
let ended = false; //Has the real-time simulation ended
let simResult = ["", false] //When the 1000x simulation ends, what is the result and is it over
let offset = [0, false] // Controls the bobbing of all the objects
let timer = false; // Nessecary for the setTimeout between cooldowns in the real-time simulation
let simLog = []; // Array of all the previous results
let display = false; // Display the log yes or no
let directions = {lefts:0,rights:0,still:0}; // How many lefts, how many rights, how many stills in an object for logs

//VISUAL/EXTRA VARIABLES

const options = {
  1: ["Σ", false, [325, 100, 375, 150]],
  2: ["Ш", false, [375, 100, 425, 150]],
  3: ["Ψ", false, [425, 100, 475, 150]],
  4: ["ﾝ", false, [475, 100, 525, 150]],
  5: ["ﾛ", false, [275, 100, 325, 150]],
  6: ["ﾀ", false, [475, 50, 525, 100]],
  7: ["Ω", false, [275, 50, 325, 100]],
  8: ["Θ", false, [475, 0, 525, 50]],
  9: ["0", false, [275, 0, 325, 50]],
  10: ["ﾐ", false, [325, 50, 375, 100]],
  11: ["ζ", false, [375, 50, 425, 100]],
  12: ["ξ", false, [425, 50, 475, 100]],
  13: ["λ", false, [325, 0, 375, 50]],
  14: ["σ", false, [375, 0, 425, 50]],
  15: ["β", false, [425, 0, 475, 50]]
}//For the secret keypad, we have the character on the key, if it has been selected, and the coordinates of the key
let fontSize = 20;//Font size of the background characters
let columns = 800/fontSize; //How many columns of characters there will be in the background
let drops = []; //Array of the y position of all the characters
let aniframe = [1, false, [0, 0, 0], 0]//Animation frame index, boolean switch, colour, direction
let secret = [false, false] // If you have activated the eye, and if you have inputted the correct keys
let matrix = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ:・.\"=*+-<>012345789¦｜çｸΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσ/ςΤτΥυΦφΧχΨψΩωabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"; //Characters for the bg

function setup() {
  angleMode(DEGREES)
  createCanvas(800, 600);
  background(0);
  ellipseMode(CENTER);
  rectMode(CENTER);
  textAlign(CENTER);
  frameRate(20);
  textSize(25);
  pixelDensity(1.5);
  for(var i = 0; i < columns; i++) {drops[i] = 1}
  buttons();
}

//VISUAL FUNCTIONS

function displayLog() {
  push()
  textFont("Courier New")
  fill(0, 255, 0)
  rect(400, 460+offset[0]/2, 775, 250)
  fill(0)
  rect(400, 460+offset[0]/2, 770, 245)
  fill(0, 255, 0)
  if (simLog.length <= 0) {
    textSize(25)
    text("None so far!", 400, 460+offset[0]/2)
  } else {
    textSize(15)
    textStyle(BOLD)
    for (var i = 0; i < simLog.length; i++) {text("At "+simLog[i][1]+" | "+simLog[i][0], 400, 365+(i*25)+offset[0]/2)}
  }
  pop()
}


function drawBg() {
  background("rgba(0, 0, 0, 0.15)")//This is actually the effect which makes everything dissapear slowly
  push()
  textSize(fontSize)
  textFont("Courier New")
  fill(0, 255, 0)
  for(var i = 0; i < drops.length; i++){
    var char = matrix[Math.floor(Math.random()*matrix.length)];//Choose a random character
    if (char == "Ω" || char == "Ψ" || char == "ﾛ" || char == "0" || char == "ζ" || char == "λ") {//Hint for the keypad code
      if (secret[0] == true) {
        push()
        textStyle(BOLD)
        textSize(fontSize+10)
        fill(255, 0, 0)
        text(char, i*fontSize, drops[i]*fontSize);
        pop()
      } else {
        push()
        textSize(fontSize+10)
        fill(255, 0, 0)
        text("👁", i*fontSize,drops[i]*fontSize)
        pop()
      }
    } else {
      text(char, i*fontSize, drops[i]*fontSize);//Write the text
    }
    if(drops[i]*fontSize > 600 && Math.random() > 0.975)//Where to start a "string" of characters
      drops[i] = 0;
      drops[i]+=0.8;//Make the characters go down
  }
  pop()
}//Draws background


function characters(frame, x, y, col, fillyn) {
  if (secret[0] == false) {//Draw the butterfly
    //Right Wing
    push()
    if (fillyn != true) {noFill();stroke(col);strokeWeight(  1)} else{fill(col)}
    beginShape()
    vertex(x, y+offset[0]*3)
    vertex(x+30-frame*0.8, y-60+offset[0]*3)
    vertex(x+70-frame*1.5, y-40+offset[0]*3)
    vertex(x+50-frame*0.9, y-10+offset[0]*3)
    endShape(CLOSE)
    beginShape()
    vertex(x, y+offset[0]*3)
    vertex(x+20-frame*0.5, y+40+offset[0]*3)
    vertex(x+65-frame*1.25, y+25+offset[0]*3)
    vertex(x+50-frame, y-2+offset[0]*3)
    endShape(CLOSE)
    pop()
    //Left Wing
    push()
    if (fillyn != true) {noFill();stroke(col);strokeWeight(1)} else {fill(col)}
      beginShape()
      vertex(x, y+offset[0]*3)
      vertex(x-60+0.9*(frame), y-50+offset[0]*3)
      vertex(x-90+1.6*(frame), y-20+offset[0]*3)
      vertex(x-75+1.4*(frame), y+10+offset[0]*3)
      endShape(CLOSE)
      beginShape()
      vertex(x, y+offset[0]*3)
      vertex(x-30+(frame)*0.55, y+50+offset[0]*3)
      vertex(x-60+1.1*(frame), y+40+offset[0]*3)
      vertex(x-50+0.9*(frame), y+10+offset[0]*3)
      endShape(CLOSE)
    pop()
  } else if (secret[0] == true && secret[1] == false) {
    if (fillyn != true) {//Draw S.A.D. robot
      push()
      noFill()
      stroke(col)
      strokeWeight(1)
      rect(x, y-100+(offset[0]*0.8), 80, 50)
      circle(x-20, y-100+(offset[0]*0.8), 25)
      circle(x+20, y-100+(offset[0]*0.8), 25)
      circle(x-20, y-100+(offset[0]*0.8), 5)
      circle(x+20, y-100+(offset[0]*0.8), 5)
      line(x, y-100+(offset[0]*0.8)-25, x+10, y-100+(offset[0]*0.8)-30)
      line(x+10, y-100+(offset[0]*0.8)-30, x-5, y-100+(offset[0]*0.8)-35)
      circle(x-10, y-100+(offset[0]*0.8)-35, 10)
      pop()
    } else {
      if (aniframe[4] == -1) {
        push()
        fill(200)
        stroke(100); strokeWeight(3)
        rect(x, y+60+offset[0], 25, 50)
        strokeWeight(5)
        line(x, y+50+offset[0], x, y+50+offset[0])
        strokeWeight(3)
        circle(x-10, y-15+offset[0], 10)
        rect(x, y+20+offset[0], 40, 50)
        fill(50)
        circle(x, y+90+offset[0], 25)
        fill(25)
        noStroke()
        circle(x, y+90+offset[0], 10)
        arc(x-20, y+20+offset[0], 20, 20, 270, 90, CHORD);
        fill(200)
        stroke(100); strokeWeight(3)
        line(x, y-5+offset[0], x+10, y-10+offset[0])
        line(x+10, y-10+offset[0], x-5, y-15+offset[0])
        textSize(10)
        fill(0)
        strokeWeight(5)
        line(x,y+15+offset[0], x+10, y+25+offset[0])
        line(x+10,y+15+offset[0], x, y+25+offset[0])
        pop()
      } 
      else if (aniframe[4] == 1) {
        push()
        fill(200)
        stroke(100); strokeWeight(3)
        rect(x, y+60+offset[0], 25, 50)
        strokeWeight(5)
        line(x, y+50+offset[0], x, y+50+offset[0])
        strokeWeight(3)
        circle(x-10, y-15+offset[0], 10)
        rect(x, y+20+offset[0], 40, 50)
        fill(50)
        circle(x, y+90+offset[0], 25)
        fill(25)
        noStroke()
        circle(x, y+90+offset[0], 10)
        arc(x+20, y+20+offset[0], 20, 20, 90, 270, CHORD);
        fill(200)
        stroke(100); strokeWeight(3)
        line(x, y-5+offset[0], x+10, y-10+offset[0])
        line(x+10, y-10+offset[0], x-5, y-15+offset[0])
        textSize(10)
        fill(0)
        noStroke()
        text("S\nA\nD\n",x-8, y+10+offset[0])
        pop()
      } else {
          push()
          fill(200)
          stroke(100); strokeWeight(3)
          rect(x, y+70+offset[0], 30, 60)
          rect(x, y+20+offset[0], 60, 50)
          fill(50)
          circle(x-15, y+20+offset[0], 20)
          circle(x+15, y+20+offset[0], 20)
          stroke(255, 0, 0)
          circle(x-15, y+20+offset[0], 3)
          circle(x+15, y+20+offset[0], 3)
          stroke(100)
          line(x, y-5+offset[0], x+10, y-10+offset[0])
          line(x+10, y-10+offset[0], x-10, y-15+offset[0])
          fill(200)
          circle(x-10, y-15+offset[0], 10)
          fill(25)
          rect(x-20, y+95+offset[0], 15, 25)
          rect(x+20, y+95+offset[0], 15, 25)
          fill(255, 0, 0)
          rect(x, y+70+offset[0], 15)
          pop()
      }
    }
  }
}//Draw & Animate the Characters


function eye(posX, posY) {
  posY = posY+offset[0]
  let v = createVector(posX, posY)//Need the x and y components of this vector to rotate
  push()
  strokeWeight(1.5)
  
  //Draw the eye
  push()
  translate(width/2+300,height/2-200-(2*offset[0]));
  /*This actually is for rotation, so let me explain:
  Rotate always rotates around the origin(0, 0) and by using translate, we can change where the origin is. We could translate using coordinates, but it's easier to use vector components(x, y) to do so.
  After that, the coordinates of what you're rotating need to change because of the new 0,0. And you need to use the atan2 function later to figure out the angle. So, in short:
  1. Create a vector by figuring out the x and y distance between (0, 0) and where your new origin will be.
  2. Translate by the vector's x and y component to set the new (0, 0). Make sure to do this in a push()pop() statement to make everything else unaffected.
  3. Remake the coordinates of what you want to rotate around the new (0, 0).
  4. Use this equation to figure out the angle to turn to: angle = atan2(targetX - current position x / targetY - current position y)
  5. Rotate the shape by whatever the angle was
  */
  stroke("#3e184a")
  beginShape();
  fill("#d9d9d9")
  vertex(-80,0);
  bezierVertex(-30,-50,30,-50,80,0);
  bezierVertex(30,50,-30,50,-80,0)
  endShape();
  fill("#6b21b5")
  ellipse(0,0,50,50);
  let EYE = atan2(v.x - width/2+300, v.y - height/2-200-(2*offset[0]))
  rotate(EYE)
  fill("#530e69")
  ellipse(10, 0, 30, 30)
  if (secret[0] == true) {fill(255, 0, 0)}
  else {fill(0, 255, 0)}
  ellipse(15,0,20,20);
  pop()
}//Draws the eye


function buttons() {
  if (secret[1] == true) {return;}//Don't run if the entire thing is over
  if (secret[0] == true) {keyPad()}//Draw the keypad if activated
  //Make the regular buttons
  push();
  textFont("Courier New")
  fill(0, 255, 0)
  rect(200, 200+offset[0]/2, 200, 100);
  rect(600, 200+offset[0]/2, 200, 100);
  rect(400, 300+offset[0]/2, 100, 50);
  fill(0)
  rect(200, 200+offset[0]/2, 195, 95);
  rect(600, 200+offset[0]/2, 195, 95);
  rect(400, 300+offset[0]/2, 95, 45);
  textSize(40);
  strokeWeight(1.5); stroke(0, 255, 0)
  fill(0, 255, 0)
  text("START", 200, 210+offset[0]/2);
  textSize(35);
  text("SIMULATE", 600, 210+offset[0]/2);
  textSize(25);
  text("LOG", 400, 307+offset[0]/2);
  pop();
  ended = true;
}//Create the buttons when simulation ends


function explode(posX, val, beamyn) {
  if (val == 1 || val == -1) {//If your character moves, draw the beam where you were
    if (val == 1) {
      push()
      textSize(100)
      fill(255)
      text("→", 700+random(0, 5), 225-offset[0]+random(0, 5))
      pop()
    } else if (val == -1) {
      push()
      textSize(100)
      fill(255)
      text("←", 700+random(0, 5), 225-offset[0]+random(0, 5))
      pop()
    }
    if (beamyn == false) {return;}
    push()
    stroke("#6f158c")
    strokeCap(SQUARE)
    strokeWeight(5)
    line(150+(posX*50), 0, (posX*50)+150, 325+offset[0])
    pop()
    setTimeout(function() {
      push()
      strokeCap(SQUARE)
      stroke("#6f158c")
      strokeWeight(30)
      line(150+(posX*50), 0, (posX*50)+150, 325+offset[0])
      pop()
    },cooldown - 100) 
  } else {//If you're not moving draw the beams around you
    push()
    textSize(100)
    fill(255)
    text("○", 700+random(0, 5), 225-offset[0]+random(0, 5))
    pop()
    if (beamyn == false) {return;}
    push()
    stroke("#6f158c")
    strokeCap(SQUARE)
    strokeWeight(5)
    line(150+(posX*50) - 50, 0, (posX*50)+150-50, 325+offset[0])
    line(150+(posX*50) + 50, 0, (posX*50)+150+50, 325+offset[0])
    pop()
    setTimeout(function() {
      push()
      strokeCap(SQUARE)
      stroke("#6f158c")
      strokeWeight(30)
      line(150+(posX*50)-50, 0, (posX*50)+150-50, 325+offset[0])
      line(150+(posX*50)+50, 0, (posX*50)+150+50, 325+offset[0])
      pop()
    },cooldown - 100) 
  }
}//Creates the "beams" and "instructions" for the characters


function base() {//Not really much to this one just a bunch of shapes
  push()
  stroke("#3e184a")

  beginShape();
  fill(30)
  vertex(168, 437+offset[0])
  vertex(267, 560+offset[0])
  vertex(357, 567+offset[0])
  vertex(429, 455+offset[0])
  vertex(330, 385+offset[0])
  endShape(CLOSE);

  beginShape();
  fill(40)
  vertex(345, 335+offset[0])
  vertex(571, 340+offset[0])
  vertex(550, 508+offset[0])
  vertex(509, 571+offset[0])
  vertex(495, 572+offset[0])
  vertex(409, 509+offset[0])
  vertex(342, 411+offset[0])
  endShape(CLOSE);

  beginShape();
  fill(50)
  vertex(618, 370+offset[0])
  vertex(650, 507+offset[0])
  vertex(624, 527+offset[0])
  vertex(493, 463+offset[0])
  endShape(CLOSE);
  
  beginShape();
  fill(80)
  vertex(135, 325+offset[0])
  vertex(273, 325+offset[0])
  vertex(293, 424+offset[0])
  vertex(209, 500+offset[0])
  vertex(154, 483+offset[0])
  vertex(102, 409+offset[0])
  endShape(CLOSE);
  
  beginShape();
  fill(90)
  vertex(255, 325+offset[0])
  vertex(364, 325+offset[0])
  vertex(359, 445+offset[0])
  vertex(334, 510+offset[0])
  vertex(274, 497+offset[0])
  vertex(262, 467+offset[0])
  vertex(232, 384+offset[0])
  endShape(CLOSE);
  
  beginShape();
  fill(100)
  vertex(364, 325+offset[0])
  vertex(478, 325+offset[0])
  vertex(460, 415+offset[0])
  vertex(421, 442+offset[0])
  vertex(364, 401+offset[0])
  endShape(CLOSE);
  
  beginShape();
  fill(80)
  vertex(466, 325+offset[0])
  vertex(554, 325+offset[0])
  vertex(566, 419+offset[0])
  vertex(547, 492+offset[0])
  vertex(510, 486+offset[0])
  vertex(477, 453+offset[0])
  endShape(CLOSE);

  beginShape();
  fill(70)
  vertex(551, 325+offset[0])
  vertex(660, 325+offset[0])
  vertex(693, 400+offset[0])
  vertex(644, 453+offset[0])
  vertex(545, 420+offset[0])
  endShape(CLOSE);
  pop()
}//Draws the floating island(Bridge)

//SIMULATION FUNCTIONS

function simulate() {
  if (display == true) {display = false}
  ended = false;//The simulation has not ended
  let counts = []//Array of the simulated times
  push()
  textFont("Courier New")
  fill(0, 255, 0)
  rect(400, 525, 450, 65)
  fill(0)
  rect(400, 525, 445, 60)
  fill(0, 255, 0)
  strokeWeight(1.5); stroke(0, 255, 0)
  text("Simulating...", 400, 530)//"Loading" message in case nothing is showing up
  pop()
  let val; let l=0; let r=0; let s=0;
  for (var i = 0; i <= 1000; i++) {//The actual simulation part
    while (x < 10 && x > 0) {
      val = random([-1, 0, 1])
      x = x+val
      if (val == 1) {r++}
      else if (val == -1) {l++}
      else {s++}
      counter++
    }
    counts.push([counter, l, r, s])
    counter = 0; x = 5; l = 0; r = 0; s = 0;
  }
  let sum = [0, 0, 0, 0];//All the times added together for average
  let arr = []
  for (var j = 0; j < counts.length; j++) {
    sum[0] = sum[0]+parseInt(counts[j][0])
    sum[1] = sum[1]+parseInt(counts[j][1])//lefts
    sum[2] = sum[1]+parseInt(counts[j][2])//rights
    sum[3] = sum[1]+parseInt(counts[j][3])//stills
    arr.push(counts[j][0])
  }
  simResult[0] = "Average time in 1000 tests:\n"+ round(sum[0]/counts.length)+" simulated seconds("+round(sum[0]/counts.length, 2)+")\nLongest "+Math.max(...arr)+"s, Shortest "+Math.min(...arr)+"s\n Average L"+round(sum[1]/counts.length, 1)+" R"+round(sum[2]/counts.length, 1)+" S"+round(sum[3]/counts.length, 1)
  simResult[1] = true//Ok now the simulation has ended
  createlog("Average: "+round(sum[0]/counts.length,2)+"s Longest: "+Math.max(...arr)+"s Shortest: "+Math.min(...arr)+"s,  L"+round(sum[1]/counts.length, 1)+" R"+round(sum[2]/counts.length, 1)+" S"+round(sum[3]/counts.length, 1), "1000")
  buttons()
}//Simulate the average time in 1000 walks


function frame() {
  if (display == true) {display = false;}
  if (ended == true) {return;}//Don't run if the simulation already ended
  counter++
  let val = parseInt(random([-1, 0, 1]))
  aniframe[4] = val;
  x = x+val
  if (val == 1) {directions.rights++}
  else if (val == -1) {directions.lefts++}
  else {directions.still++}
  return val;
}//Calculates 1 move in the real-time simulation

//EVENT FUCNTIONS

function createlog(message, type) {
  let today = new Date();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  if (type == "realtime") {simLog.push([message, time, "Real Time"])}
  else if (type == "1000") {simLog.push([message, time, "1000 Sims"])}
  if (simLog.length >= 10) {simLog.shift();}
}//Logs the 10 most recent simulation results


function draw(){
  drawBg()//1. Draw the background
  if (display == true) {displayLog()}
  if (secret[1] == true) {//Did the user complete the secret?
    noLoop();
    txt(["PHILOSOPHICAL EXPLANATION","The simulation is in an infinite loop, which is inescapable unless you do something. In this case, that's either to stop the program or let the eye do it for you as you're doing now.", "The eye itself is a metaphor for the user, because both of you are watching the characters who can't escape the infinite loop. It's only one eye because it can only do one thing.", "This really exposes the duality of you starting the simulation, but also ending it.", "The true villain and hero of this \"game\" is you.","With that being said, the butterfly and S.A.D. robot are no longer trapped thanks to your efforts.", "I have to write an essay in english class so I'm practicing analysis","end"], 400, 100)
  }
  if (offset[0] >= 5) {offset[1] = false} //Control the offset value
  else if (offset[0] <= -5) {offset[1] = true}
  if (offset[1] == true) {offset[0]+=0.2} else {offset[0]-=0.2}
  
  if (simResult[1] == true) {//Display the result of the simulation
    push()
    textFont("Courier New")
    fill(0, 255, 0)
    rect(400, 415+offset[0]/2, 450, 150)
    fill(0)
    rect(400, 415+offset[0]/2, 445, 145)
    fill(0, 255, 0)
    strokeWeight(1.5); stroke(0, 255, 0)
    text(simResult[0], 400, 375+offset[0]/2)
    pop()
  }
  
  if (x >= 10 || x <=0) {//Stop the real-time simulation after the character walks off the "bridge"
    x = 5
    createlog("Final Time: "+counter+"s"+"(Left "+directions.lefts+", Right "+directions.rights+", Still "+directions.still+")", "realtime");
    buttons()
  }
  if (ended == true && display == false && simResult[1] != true && counter!= 0) {
    push()
    textFont("Courier New")
    fill(0, 255, 0)
    rect(400, 400+offset[0]/2, 500, 75)
    fill(0)
    rect(400, 400+offset[0]/2, 495, 70)
    fill(0, 255, 0)
    strokeWeight(1.5); stroke(0, 255, 0)
    text("Final time: "+counter+" simulated seconds"+"\n(Left "+directions.lefts+", Right "+directions.rights+", Still "+directions.still+")", 400, 390+offset[0]/2)
    pop()
  }
  if (aniframe[0] >=50) {
    aniframe[1] = false;
    aniframe[2] = [random(255), random(255), random(255)]
  } else if (aniframe[0] <=1) {
    aniframe[1] = true;
    aniframe[2] = [random(255), random(255), random(255)]}
  if (aniframe[1] == true) {aniframe[0]+=5}
  else {aniframe[0]-=5}
  
  if (ended == true) {
    if (secret[0] == false) {
      characters(aniframe[0], 410, 205, [255, 0, 0], false)
    } else if (secret[0] == true && secret[1] == false) {
      characters(aniframe[0], 400, 300, [255, 0, 0], false)
    }
    buttons();
    return;}
  if (ended != true) {
    characters(aniframe[0], 150+(x*50), 225, aniframe[2], true)
  }
  
  //Anything after this will only run if started
  base()
  eye((x*50)+150, 325)
  for (var i = 0; i <= 10; i++) {
    push()
    fill(255)
    stroke(255)
    strokeWeight(3)
    line(150+i*50, 330+offset[0], 150+i*50, 345+offset[0])
    pop()
    push()
    textFont("Courier New")
    stroke(255)
    fill(255)
    text(i, 150+i*50, 370+offset[0])
    pop()
  }
  push()
  textFont("Courier New")
  fill(0, 255, 0)
  rect(100, 75, 200, 115)
  fill(0)
  rect(100, 75, 195, 110)
  fill(0, 255, 0)
  strokeWeight(1.5); stroke(0, 255, 0)
  text("Position: "+x+"\nTime(s): "+counter+"\nL"+directions.lefts+" R"+directions.rights+" S"+directions.still, 100, 50)
  pop()
  
  if (timer != true) {
    timer = true
    setTimeout(function(){
      if (secret[0] == true) {explode(x, frame(), true);} else {explode(x,frame(), false);}
      timer = false;
    }, cooldown)
  }
}//Main loop


function mousePressed() {
  if (secret[1] == true) {return;}
  if (secret[0] == true && ended == true) {//If you pressed a key on the keypad, it changes the property in the object
    for (const prop in options) {
      if (mouseX >= options[prop][2][0] && mouseX <= options[prop][2][2] && mouseY >= options[prop][2][1] && mouseY <= options[prop][2][3]) {
        if (options[prop][1] == true) {
          options[prop][1] = false;
        } else {
          options[prop][1] = true;
        }
      }
    }
    if (code([3, 5, 7, 9, 11, 13]) == true) {setTimeout(function(){secret[1] = true}, 1000)}//This is the code for the keypad
    }
  
  if (ended == false) {//Checks if you activated the eye
    if (dist(mouseX, mouseY, 700, 100-2*offset[0]) <= 25) {
      if (secret[0] == false) {
        secret[0] = true;
        push()
        fill(255, 0, 0)
        rect(400, 300, 1000)
        pop()
      }
      else {
        secret[0] = false;
        push()
        fill(0, 255, 0)
        rect(400, 300, 1000)
        pop()
      }
    }
    return;
  }
  else {//If the simulation ended that must mean that the buttons are drawn
    if (simResult[1] == true) {simResult[1] = false}
    if (mouseX >= 100 && mouseX <= 300 && mouseY >=150 && mouseY <=250) {
      ended = false;
      x = 5;
      counter = 0;
      directions.lefts=0;directions.rights=0;directions.still=0;
    } else if (mouseX >= 500 && mouseX <= 700 && mouseY >=150 && mouseY <= 250) {
      simulate()
    } else if (mouseX >= 350 && mouseX <= 450 && mouseY >= 275 && mouseY <= 325) {
      if (display == true) {
        display = false
      } else {display = true}
    }
  }
}//Allows you to press buttons


function delay(time) {return new Promise(resolve => setTimeout(resolve, time));}//Delay for the end text


function waitingKeypress() {
  return new Promise((resolve) => {//Create a new promise which will be resolved by pressing a key
    document.addEventListener('keydown', onKeyHandler);
    function onKeyHandler(e) {
      document.removeEventListener('keydown', onKeyHandler);
      resolve();//Resolve
    }
  });
}//In the final message, this waits for the user to press "z"

//SECRET FUNCTIONS

function keyPad() {
  push()
  strokeWeight(3)
  push()
  rectMode(CORNERS)
  textFont("Courier New")
  textSize(25)
  textStyle(BOLD)
  for (const property in options) {
    stroke(255, 0, 0);strokeWeight(3)
    if (options[property][1] == false) {//If you haven't selected it
      noFill()
      noStroke()
    } else { //If you have
      fill(255, 0, 0)
      stroke(0)
    }//Basically, read the coordinates of the keys in the object and draw a rectangle there
    rect(options[property][2][0],options[property][2][1]+offset[0]/2,options[property][2][2],options[property][2][3]+offset[0]/2);
    fill(255, 0, 0)
    noStroke()
    text(options[property][0], (options[property][2][0]+options[property][2][2])/2, options[property][2][3]-15+offset[0]/2)
  }
  pop()
  rectMode(CENTER)
  pop()
}//Draw and edit the keys if clicked


function code(trues) {
  let falses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];//Starts as total number of options
  for (var i = 0; i < trues.length; i++) {//Separates the keys which need to be pressed from falses
    if (falses.includes(parseInt(trues[i]))) {
      falses.splice(falses.indexOf(trues[i]), 1)
    }
  }
  for (var k = 0; k < falses.length; k++) {if (options[falses[k]][1] == true) {return false;}}//Checks if everything in falses is false
  for (var l = 0; l < trues.length; l++) {if (options[trues[l]][1] == false) {return false;}}//Checks if everything in trues is true
  for (var m = 1; m <= falses.length+trues.length; m++) {options[m][1] = false;}//If everything is good, reset everything
  return true;
}//Checks if the user has correctly inputted the code, returns true if yes and false if no


async function txt(t, posX, posY) {
  for (var j = 0; j <t.length; j++) {//For every string in the entered array
    let tArr = []//Array of characters
    let prevText = ""//What text to display
    let textPos = 0//Counter for automatic line breaking
    tArr = t[j].split("");
    let counter = 0;
    for (var i = 0; i<tArr.length; i++) {
      if (tArr[i] == " ") {//Is the counter too long if so add a line break
        counter++
      }
      if (counter >= 3){
        counter = 0;
        textPos++
        prevText = prevText + "\n"}
      if (tArr[i] == "|") {//If the character is "|" pause dramatically
        await delay(200)
      } 
      else {//Create the text & add the next character to prevtext
        await delay(50);
        background(0)
        prevText = prevText+ tArr[i]
        push()
        fill(255)
        textSize(25)
        textFont("Courier New")
        text(prevText, posX, posY)
        pop()
      }
    }
    await waitingKeypress();//Wait for the keypress to do the next element in the array entered
  }
  background(0)
  remove();
}//Makes the cool letter-by-letter text animation
