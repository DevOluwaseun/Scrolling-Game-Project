/*
 FINAL GAME PROJECT 

 
Extentions: 
(1) Add Sounds
(2) Create Platforms
(3) Create Enemies


(1) Add Sound

        Difficulties: 
        I found it difficult to  stop the sounds from replaying several times in the draw function. The draw loop keeps calling the sounds several times when i only want it called once. I also found it diffcult to implement sounds in the background, the background sounds refuse to play when thought it was called in the setup function.

        
        Skills learnt and practiced:
        In order to resolve the sound looping in the draw functions i used an if else statement to counter it when it has been called once. I also used the chrome source debugger tools to resolve the background sound not playing, which helped me check why the sound function was not beens called. it deepens my kowledge on the chrome debugger tools.


(2) Create Platforms

        Difficulties:
        I found it difficult to get the character to jump from the platform and also realise a bug in my code  game character real location, the character did not also land of my platform on several attempt. 

        Skills learnt and practiced:
        In order to resolve the character not jumping from my platform, i had to check the if else statement for my character movement and jumping conditions 


(3) Create Enemies

        Difficulties:
        I found it difficult to understand how the factory function works in implementing the enemies.

    
        Skills learnt and practiced:
        In order to resolve this i went to further read about the factory function of Javascript documentation and practice the function be rewatching the enemies tutor video.


*/



var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var collectables;
var canyons;
var trees_x;
var treePos_y;
var cloud;
var mountain;
var cameraPosX;
var game_score;
var flagpole;
var lives;
var collectSound;
var fellSound;
var gameOverSound;
var wonSound;
var backgroundSound;
var jumpSound;
var gameSound;
var platforms;
var gameCharWorldX;
var enemies;

function preload() {
  soundFormats("mp3", "wav");

  //Loads Sounds and Set Volume
  jumpSound = loadSound("assets/jump2.wav");
  jumpSound.setVolume(0.3);
  collectSound = loadSound("assets/collectibles2.mp3");
  collectSound.setVolume(0.2);
  gameSound = loadSound("assets/gamesound.wav");
  gameSound.setVolume(0.2);
  fellSound = loadSound("assets/falling.mp3");
  fellSound.setVolume(0.3);
  wonSound = loadSound("assets/won.mp3");
  gameOverSound = loadSound("assets/gameover.mp3");
}

function setup() {
  createCanvas(1024, 576);
  gameSound.loop();
  floorPos_y = (height * 3) / 4;
  lives = 3;
  startGame();
}

function draw() {
  // Draws Background and Ground
  background(100, 155, 255);
  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height - floorPos_y);

  //Save the current state of the program
  push();

  //scroll Mountains and clouds slowly
  translate(cameraPosX / 4, 0);

  // Draws Mountain
  drawMountains();

  // Draws Clouds
  drawClouds();
  pop();

  //Scroll background
  push();
  translate(cameraPosX, 0);

  //Draws canyon and check if play is in canyon
  for (var i = 0; i < canyons.length; i++) {
    drawCanyon(canyons[i]);
    checkCanyon(canyons[i]);
  }

  //Draws Trees
  drawTrees();

  // Draws Platforms
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }

  //Draws collectables  and checks if the play found them
  for (var i = 0; i < collectables.length; i++) {
    if (!collectables[i].isFound) {
      drawCollectable(collectables[i]);

      checkCollectable(collectables[i]);
    }
  }

  //Call flagpole and check if its found
  renderFlagpole();
  if (!flagpole.isReached) {
    checkFlagpole();
  }

  //Draws enemies and check if player is in contact with it
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();

    var isContact = enemies[i].checkContact(gameCharWorldX, gameChar_y);

    if (isContact) {
      if (lives > 0) {
        fellSound.play();
        startGame();
        lives -= 1;
        break;
      }
    }
  }
  checkPlayerDie();

  //pop
  pop();

  //Draws game character
  gameCharaters();

  //Score Counter
  stroke(225);
  strokeWeight(3);
  fill(100);
  textSize(18);
  text("Game Score: " + game_score, 20, 35);

  //  Draw ellipse representing lives
  for (i = 0; i < lives; i++) {
    strokeWeight(3);
    fill(210, 105, 30);
    ellipse(35 + i * 30, 55, 22);
  }

  //Check is game is completed
  gameCompleted();

  //Check if game is over
  gameOver();

  //Update real position of Character for collision
  gameCharWorldX = gameChar_x - cameraPosX;

  ///////////INTERACTION CODE//////////
  //Logic to make character move
  if (!isPlummeting) {
    if (isLeft == true) {
      if (gameChar_x > width * 0.35) {
        gameChar_x -= 2;
      } else {
        cameraPosX += 2;
      }
    }

    if (isRight == true) {
      if (gameChar_x < width * 0.65) {
        gameChar_x += 2;
      } else {
        cameraPosX -= 2;
      }
    }

    //Logic to make character jump
    if (gameChar_y < floorPos_y) {
      var isContact = false;
      for (var i = 0; i < platforms.length; i++) {
        if (platforms[i].checkContact(gameCharWorldX, gameChar_y)) {
          isFalling = false;
          isContact = true;
          break;
        }
      }
      if (isContact == false) {
        gameChar_y += 2;
        isFalling = true;
      }
    } else {
      isFalling = false;
    }
  }
}

function startGame() {
  //variables for scrolling
  cameraPosX = 0;
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;

  treePos_y = floorPos_y - 145;
  game_score = 0;

  //Update real position of Character for collision
  gameCharWorldX = gameChar_x - cameraPosX;

  //Variable for Character moving logic
  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;

  //Collectables  Coin Position arrays
  collectables = [
    { x_pos: 100, y_pos: 310, size: 40, isFound: false },
    { x_pos: 300, y_pos: 410, size: 40, isFound: false },
    { x_pos: 450, y_pos: 410, size: 40, isFound: false },
    { x_pos: 700, y_pos: 310, size: 40, isFound: false },
    { x_pos: 850, y_pos: 410, size: 40, isFound: false },
    { x_pos: 980, y_pos: 410, size: 40, isFound: false },
    { x_pos: 1150, y_pos: 310, size: 40, isFound: false },
    { x_pos: 1300, y_pos: 310, size: 40, isFound: false },
    { x_pos: 1500, y_pos: 310, size: 40, isFound: false },
    { x_pos: 1700, y_pos: 410, size: 40, isFound: false },
    { x_pos: 1850, y_pos: 400, size: 40, isFound: false },
    { x_pos: 2100, y_pos: 310, size: 40, isFound: false },
    { x_pos: 2400, y_pos: 410, size: 40, isFound: false },
    { x_pos: 2700, y_pos: 410, size: 40, isFound: false },
    { x_pos: 2900, y_pos: 410, size: 40, isFound: false },
    { x_pos: 3200, y_pos: 270, size: 40, isFound: false },
    { x_pos: 3500, y_pos: 410, size: 40, isFound: false },
    { x_pos: 3700, y_pos: 410, size: 40, isFound: false },
    { x_pos: 4000, y_pos: 410, size: 40, isFound: false },
    { x_pos: 4200, y_pos: 410, size: 40, isFound: false },
    { x_pos: 4600, y_pos: 360, size: 40, isFound: false },
    { x_pos: 4800, y_pos: 410, size: 40, isFound: false },
  ];

  // Canyon position Arrays
  canyons = [
    { x_pos: -500, width: 450 },
    { x_pos: 200, width: 100 },
    { x_pos: 650, width: 150 },
    { x_pos: 1100, width: 80 },
    { x_pos: 1700, width: 300 },
    { x_pos: 2200, width: 60 },
    { x_pos: 2550, width: 140 },
    { x_pos: 3000, width: 300 },
    { x_pos: 3400, width: 100 },
    { x_pos: 3700, width: 150 },
    { x_pos: 4200, width: 580 },

    { x_pos: 4900, width: 150 },
  ];

  //Trees position array
  trees_x = [
    330, 380, 500, 500, 650, 700, 800, 1100, 1300, 1600, 1700, 1900, 2200, 2300,
    2450, 2600, 2800, 2950, 3200, 3350, 3500, 3600, 3900, 4200, 4300, 4500,
    4700, 4900, 5000,
  ];

  //Cloud position array
  cloud = [
    { x_pos: 100, y_pos: 100, size: 50 },
    { x_pos: 500, y_pos: 120, size: 100 },
    { x_pos: 900, y_pos: 60, size: 90 },
    { x_pos: 1300, y_pos: 90, size: 55 },
    { x_pos: 1700, y_pos: 110, size: 80 },
    { x_pos: 2100, y_pos: 90, size: 50 },
    { x_pos: 2500, y_pos: 120, size: 85 },
    { x_pos: 2900, y_pos: 60, size: 80 },
    { x_pos: 3300, y_pos: 70, size: 70 },
    { x_pos: 3700, y_pos: 50, size: 100 },
    { x_pos: 4100, y_pos: 115, size: 50 },
    { x_pos: 4500, y_pos: 60, size: 75 },
    { x_pos: 4900, y_pos: 90, size: 100 },
    { x_pos: 5300, y_pos: 100, size: 60 },
    { x_pos: 5700, y_pos: 60, size: 50 },
    { x_pos: 6100, y_pos: 120, size: 90 },
  ];

  //Mountain Position array
  mountain = [
    { x_pos: 40, y_pos: 432, size: 150 },
    { x_pos: 800, y_pos: 432, size: 180 },
    { x_pos: 1700, y_pos: 432, size: 155 },
    { x_pos: 2600, y_pos: 432, size: 116 },
    { x_pos: 3500, y_pos: 432, size: 160 },
    { x_pos: 4500, y_pos: 432, size: 110 },
  ];

  //platform array
  platforms = [];

  //create platform with factory function
  platforms.push(createPlatforms(80, floorPos_y - 100, 100));
  platforms.push(createPlatforms(1200, floorPos_y - 100, 100));
  platforms.push(createPlatforms(1400, floorPos_y - 100, 200));
  platforms.push(createPlatforms(1820, floorPos_y - 5, 50));
  platforms.push(createPlatforms(3000, floorPos_y - 100, 100));
  platforms.push(createPlatforms(3200, floorPos_y - 140, 50));
  platforms.push(createPlatforms(4200, floorPos_y - 100, 50));
  platforms.push(createPlatforms(4300, floorPos_y - 50, 100));
  platforms.push(createPlatforms(4450, floorPos_y - 120, 40));
  platforms.push(createPlatforms(4550, floorPos_y - 40, 60));
  platforms.push(createPlatforms(4650, floorPos_y - 60, 60));
  platforms.push(createPlatforms(4800, floorPos_y - 80, 60));
  platforms.push(createPlatforms(5000, floorPos_y - 40, 50));

  //flatpole Object
  flagpole = { x_pos: 5200, y_pos: 332, size: 100, isReached: false };

  //Enemies array
  enemies = [];

  //Create enemy
  enemies.push(new enemy(100, floorPos_y, 100));
  enemies.push(new enemy(800, floorPos_y, 300));
  enemies.push(new enemy(1400, floorPos_y, 300));
  enemies.push(new enemy(2000, floorPos_y, 200));
  enemies.push(new enemy(2700, floorPos_y, 300));
  enemies.push(new enemy(3500, floorPos_y, 200));
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed() {
  // Function the respond to Key press

  if (keyCode == 65) {
    isLeft = true;
  } else if (keyCode == 68) {
    isRight = true;
  }

  if (keyCode == 87) {
    if (!isFalling && !isPlummeting) {
      gameChar_y -= 150;
      jumpSound.play();
    }
  }

  if ((keyCode == 32 && gameOver()) || (keyCode == 32 && gameCompleted())) {
    restartGame();
  }
}

function keyReleased() {
  // if statements to control the animation of the character
  if (keyCode == 65) {
    isLeft = false;
  } else if (keyCode == 68) {
    isRight = false;
  }
}

// ------------------------------
// Cloud Draw Functions
// ------------------------------
function drawClouds() {
  for (var i = 0; i < cloud.length; i++) {
    fill(255, 255, 255);
    ellipse(cloud[i].x_pos - 20, cloud[i].y_pos, cloud[i].size);
    ellipse(cloud[i].x_pos + 10, cloud[i].y_pos - 20, cloud[i].size);
    ellipse(cloud[i].x_pos + 10, cloud[i].y_pos + 30, cloud[i].size);
    ellipse(cloud[i].x_pos + 40, cloud[i].y_pos - 25, cloud[i].size);
    ellipse(cloud[i].x_pos + 40, cloud[i].y_pos + 20, cloud[i].size);
    ellipse(cloud[i].x_pos + 60, cloud[i].y_pos, cloud[i].size);
    ellipse(cloud[i].x_pos + 20, cloud[i].y_pos, cloud[i].size);
  }
}

// ------------------------------
// Mountain Draw Functions
// ------------------------------
function drawMountains() {
  for (var i = 0; i < mountain.length; i++) {
    fill(210, 105, 30);
    triangle(
      mountain[i].x_pos,
      mountain[i].y_pos - mountain[i].size * 1.94,
      mountain[i].x_pos - mountain[i].size * 0.5,
      mountain[i].y_pos,
      mountain[i].x_pos + mountain[i].size * 1.5,
      mountain[i].y_pos
    );
    fill(233, 150, 122);
    triangle(
      mountain[i].x_pos,
      mountain[i].y_pos - mountain[i].size * 1.94,
      mountain[i].x_pos - mountain[i].size * 1.8,
      mountain[i].y_pos,
      mountain[i].x_pos - mountain[i].size * 0.5,
      mountain[i].y_pos
    );

    fill(240, 248, 255);
    triangle(
      mountain[i].x_pos - mountain[i].size * 0.5,
      mountain[i].y_pos - mountain[i].size * 1.5,
      mountain[i].x_pos - mountain[i].size * 0.5,
      mountain[i].y_pos,
      mountain[i].x_pos + mountain[i].size * 1.5,
      mountain[i].y_pos
    );
    fill(169, 169, 169);
    triangle(
      mountain[i].x_pos - mountain[i].size * 0.5,
      mountain[i].y_pos - mountain[i].size * 1.5,
      mountain[i].x_pos - mountain[i].size * 1.8,
      mountain[i].y_pos,
      mountain[i].x_pos - mountain[i].size * 0.5,
      mountain[i].y_pos
    );

    fill(240, 248, 255);
    triangle(
      mountain[i].x_pos + mountain[i].size * 0.8,
      mountain[i].y_pos - mountain[i].size * 1.3,
      mountain[i].x_pos - mountain[i].size * 0.5,
      mountain[i].y_pos,
      mountain[i].x_pos + mountain[i].size * 1.8,
      mountain[i].y_pos
    );
    fill(169, 169, 169);
    triangle(
      mountain[i].x_pos + mountain[i].size * 0.8,
      mountain[i].y_pos - mountain[i].size * 1.3,
      mountain[i].x_pos - mountain[i].size * 1.8,
      mountain[i].y_pos,
      mountain[i].x_pos - mountain[i].size * 0.5,
      mountain[i].y_pos
    );
  }
}

// ------------------------------
// Tree Draw Functions
// ------------------------------
function drawTrees() {
  for (var i = 0; i < trees_x.length; i++) {
    fill(205, 133, 63);
    rect(trees_x[i], treePos_y + 60, 20, 85);

    fill(107, 142, 35);
    triangle(
      trees_x[i] + 5,
      treePos_y + 16,
      trees_x[i] + 50,
      treePos_y + 68,
      trees_x[i] - 40,
      treePos_y + 68
    );
    triangle(
      trees_x[i] + 5,
      treePos_y - 10,
      trees_x[i] + 50,
      treePos_y + 38,
      trees_x[i] - 40,
      treePos_y + 38
    );
    triangle(
      trees_x[i] + 5,
      treePos_y - 36,
      trees_x[i] + 50,
      treePos_y + 8,
      trees_x[i] - 40,
      treePos_y + 8
    );
  }
}

// ------------------------------
// Collectable Draw Functions
// ------------------------------
function drawCollectable(t_collectable) {
  if (t_collectable.isFound == false) {
    fill(255, 215, 0);
    push();
    ellipseMode(CENTER);
    ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size);
    fill(218, 165, 32);
    ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 10);

    fill(255, 215, 0);
    textSize(t_collectable.size - 20);
    text("£", t_collectable.x_pos - 5, t_collectable.y_pos + 7);
    pop();
  }
}

// ------------------------------
// Collectable check Functions
// ------------------------------
function checkCollectable(t_collectable) {
  //check distance between real character position and collectable
  var distance = dist(
    gameCharWorldX,
    gameChar_y,
    t_collectable.x_pos,
    t_collectable.y_pos
  );
  if (distance < t_collectable.size) {
    t_collectable.isFound = true;
    game_score += 1;
    collectSound.play();
  }
}

// ------------------------------
// Canyon Draw Functions
// ------------------------------
function drawCanyon(t_canyon) {
  fill(175, 238, 238);
  rect(t_canyon.x_pos, 432, t_canyon.width, 300);
  fill(100, 155, 255);
  rect(t_canyon.x_pos, 432, t_canyon.width, 100);
  fill(210, 105, 30);
  rect(t_canyon.x_pos, 432, 10, 300);
  fill(240, 128, 128);
  rect(t_canyon.x_pos + t_canyon.width, 432, 10, 300);
}

// ------------------------------
// Canyon check Functions
// ------------------------------
function checkCanyon(t_canyon) {
  if (
    (gameCharWorldX > t_canyon.x_pos + 20 &&
      gameCharWorldX < t_canyon.x_pos + t_canyon.width &&
      gameChar_y >= floorPos_y) ||
    gameChar_y > floorPos_y
  ) {
    isPlummeting = true;
  } else {
    isPlummeting = false;
  }

  if (isPlummeting == true) {
    gameChar_y += 1;
    if (fellSound.isPlaying() == false && lives > 0) {
      fellSound.play(); // play fell sounds
    }
  }
}

// ------------------------------
// Flagpole  Functions
// ------------------------------
function renderFlagpole() {
  push();
  strokeWeight(1);
  stroke(0);
  fill(255, 215, 0);
  rect(flagpole.x_pos, flagpole.y_pos, flagpole.size, flagpole.size);
  fill(128, 0, 0);
  triangle(
    flagpole.x_pos + 45,
    flagpole.y_pos - 50,
    flagpole.x_pos + 115,
    flagpole.y_pos,
    flagpole.x_pos - 20,
    flagpole.y_pos
  );
  fill(160, 82, 45);
  rect(
    flagpole.x_pos - 5,
    flagpole.y_pos + 90,
    flagpole.size + 10,
    flagpole.size - 90
  );
  rect(
    flagpole.x_pos - 10,
    flagpole.y_pos + 5,
    flagpole.size - 88,
    flagpole.size - 90
  );
  rect(
    flagpole.x_pos + 98,
    flagpole.y_pos + 5,
    flagpole.size - 88,
    flagpole.size - 90
  );
  fill(65, 105, 225);
  fill(65, 105, 225);
  strokeWeight(1.5);
  rect(
    flagpole.x_pos + 25,
    flagpole.y_pos + 15,
    flagpole.size - 50,
    flagpole.size - 50
  );
  noStroke();
  fill(135, 206, 235);
  rect(
    flagpole.x_pos + 30,
    flagpole.y_pos + 20,
    flagpole.size - 60,
    flagpole.size - 60
  );
  fill(65, 105, 225);
  rect(
    flagpole.x_pos + 48,
    flagpole.y_pos + 20,
    flagpole.size - 95,
    flagpole.size - 60
  );
  rect(
    flagpole.x_pos + 30,
    flagpole.y_pos + 38,
    flagpole.size - 60,
    flagpole.size - 95
  );

  fill(0);
  rect(
    flagpole.x_pos + 100,
    flagpole.y_pos - 195,
    flagpole.size - 95,
    flagpole.size + 100
  );
  ellipse(flagpole.x_pos + 102, flagpole.y_pos - 195, flagpole.size - 90);
  fill(220, 20, 60);

  // Makes flag on flagPole come down if character is in contact with Flagpole
  if (flagpole.isReached) {
    rect(
      flagpole.x_pos + 100,
      flagpole.y_pos - 50,
      flagpole.size - 50,
      flagpole.size - 60
    );
  } else {
    rect(
      flagpole.x_pos + 100,
      flagpole.y_pos - 188,
      flagpole.size - 50,
      flagpole.size - 60
    );
  }
  pop();
}

//check is charactoer is in contact with Flag pole
function checkFlagpole() {
  if (
    dist(gameCharWorldX, gameChar_y, flagpole.x_pos + 50, flagpole.y_pos) < 110
  ) {
    flagpole.isReached = true;
    isFalling = false;
    wonSound.play();
    gameSound.stop();
  }
}

// ------------------------------
// Game State Functions
// ------------------------------
//check if player dies
function checkPlayerDie() {
  if (gameChar_y > floorPos_y + 400) {
    lives -= 1;
    if (lives > 0) {
      startGame(); //restart game
    }
  }
}

//End game when lives is used up
function gameOver() {
  textSize(30);
  fill(178, 34, 34);
  if (lives < 1) {
    text("Game Over. Press space to continue", 250, 300);
    text("Your Scores is " + game_score, 400, 400);
    gameSound.stop();
    if (gameOverSound.isPlaying() == false) {
      gameOverSound.play();
    }
    return true;
  }
}

//Restart game of begining
function restartGame() {
  gameSound.loop();
  lives = 3;
  startGame();
}

// Shows game is complete
function gameCompleted() {
  if (flagpole.isReached == true) {
    isLeft = false;
    isRight = false;
    textSize(30);
    text("Level Complete", 400, 300);
    text("Your Scores is " + game_score, 400, 350);
    return;
  }
}

// ------------------------------
// Game Platform Functions
// ------------------------------
function createPlatforms(x, y, length) {
  var p = {
    x: x,
    y: y,
    length: length,
    draw: function () {
      fill(139, 69, 19);
      rect(this.x, this.y, this.length, 20);
    },

    checkContact: function (gc_x, gc_y) {
      if (gc_x > this.x && gc_x < this.x + this.length) {
        var d = this.y - gc_y;
        if (d >= 0 && d < 2) {
          return true;
        }
        return false;
      }
    },
  };

  return p;
}

// ------------------------------
// Game Enemy Functions
// ------------------------------
function enemy(x, y, range) {
  (this.x = x), (this.y = y), (this.range = range);

  this.currentX = x;
  this.inc = 1;

  this.update = function () {
    this.currentX += this.inc;

    if (this.currentX >= this.x + this.range) {
      this.inc = -1;
    } else if (this.currentX < this.x) {
      this.inc = 1;
    }
  };

  this.draw = function () {
    this.update();
    fill(255, 0, 0);

    fill(255, 0, 0);
    noStroke();
    ellipse(this.currentX, this.y - 23, 45);
    fill(255);
    stroke(255, 0, 0);
    ellipse(this.currentX - 15, this.y - 23, 23);
    fill(0);
    noStroke();
    ellipse(this.currentX - 15, this.y - 23, 8.5);
    fill(255);
    ellipse(this.currentX - 17, this.y - 25, 2.5);
    //Right eyes

    fill(255);
    stroke(255, 0, 0);
    ellipse(this.currentX + 15, this.y - 23, 23);
    fill(0);
    noStroke();
    ellipse(this.currentX + 15, this.y - 23, 8.5);
    fill(255);
    ellipse(this.currentX + 15, this.y - 25, 2.5);

    //mouth
    fill(0);
    rect(this.currentX - 8, this.y - 14, 16, 8);
  };

  this.checkContact = function (gc_x, gc_y) {
    var d = dist(gc_x, gc_y, this.currentX, this.y);

    if (d < 45) {
      return true;
    }

    return false;
  };
}

// ------------------------------
// Game character render function
// ------------------------------
function gameCharaters() {
  if (isLeft && isFalling) {
    // jumping-left code
    stroke(2);
    strokeWeight(0.57);
    fill(255, 140, 0);
    triangle(
      gameChar_x,
      gameChar_y - 50,
      gameChar_x - 20,
      gameChar_y - 10,
      gameChar_x + 20,
      gameChar_y - 10
    );
    noStroke();

    //Eyes

    fill(255);
    ellipse(gameChar_x - 3, gameChar_y - 25, 10);
    ellipse(gameChar_x - 10, gameChar_y - 25, 10);
    fill(0);
    ellipse(gameChar_x - 3, gameChar_y - 25, 5);
    ellipse(gameChar_x - 10, gameChar_y - 25, 5);

    //Mouth
    fill(0);
    ellipse(gameChar_x - 10, gameChar_y - 16, 3);

    //Legs
    fill(72, 61, 139);
    rect(gameChar_x - 4, gameChar_y - 10, 5, 6);
    rect(gameChar_x + 4, gameChar_y - 10, 5, 6);

    stroke(0);
    strokeWeight(3);
    line(gameChar_x - 15, gameChar_y - 20, gameChar_x - 17, gameChar_y - 40);
    line(gameChar_x + 15, gameChar_y - 20, gameChar_x + 17, gameChar_y - 40);
    strokeWeight(1);
  } else if (isRight && isFalling) {
    // jumping-right code
    stroke(2);
    strokeWeight(0.57);
    fill(255, 140, 0);
    triangle(
      gameChar_x,
      gameChar_y - 50,
      gameChar_x - 20,
      gameChar_y - 10,
      gameChar_x + 20,
      gameChar_y - 10
    );
    noStroke();

    //Eyes

    fill(255);
    ellipse(gameChar_x + 3, gameChar_y - 25, 10);
    ellipse(gameChar_x + 10, gameChar_y - 25, 10);
    fill(0);
    ellipse(gameChar_x + 3, gameChar_y - 25, 5);
    ellipse(gameChar_x + 10, gameChar_y - 25, 5);

    //Mouth
    fill(0);
    ellipse(gameChar_x + 10, gameChar_y - 16, 3);

    //Legs
    fill(72, 61, 139);
    rect(gameChar_x - 4, gameChar_y - 10, 5, 6);
    rect(gameChar_x + 4, gameChar_y - 10, 5, 6);

    stroke(0);
    strokeWeight(3);
    line(gameChar_x - 15, gameChar_y - 20, gameChar_x - 17, gameChar_y - 40);
    line(gameChar_x + 15, gameChar_y - 20, gameChar_x + 17, gameChar_y - 40);
    strokeWeight(1);
  } else if (isLeft) {
    //walking left code
    stroke(2);
    strokeWeight(0.57);
    fill(255, 140, 0);
    triangle(
      gameChar_x,
      gameChar_y - 50,
      gameChar_x - 20,
      gameChar_y - 10,
      gameChar_x + 20,
      gameChar_y - 10
    );
    noStroke();

    //Eyes

    fill(255);
    ellipse(gameChar_x - 3, gameChar_y - 25, 10);
    ellipse(gameChar_x - 10, gameChar_y - 25, 10);
    fill(0);
    ellipse(gameChar_x - 3, gameChar_y - 25, 5);
    ellipse(gameChar_x - 10, gameChar_y - 25, 5);

    //Mouth
    fill(0);
    ellipse(gameChar_x - 10, gameChar_y - 16, 3);

    //Legs
    fill(72, 61, 139);
    rect(gameChar_x - 4, gameChar_y - 10, 5, 10);
    rect(gameChar_x + 4, gameChar_y - 10, 5, 10);
  } else if (isRight) {
    // Walking right code
    stroke(2);
    strokeWeight(0.57);
    fill(255, 140, 0);
    triangle(
      gameChar_x,
      gameChar_y - 50,
      gameChar_x - 20,
      gameChar_y - 10,
      gameChar_x + 20,
      gameChar_y - 10
    );
    noStroke();
    //Eyes

    fill(255);
    ellipse(gameChar_x + 3, gameChar_y - 25, 10);
    ellipse(gameChar_x + 10, gameChar_y - 25, 10);
    fill(0);
    ellipse(gameChar_x + 3, gameChar_y - 25, 5);
    ellipse(gameChar_x + 10, gameChar_y - 25, 5);

    //Mouth
    fill(0);
    ellipse(gameChar_x + 10, gameChar_y - 16, 3);

    //Legs
    fill(72, 61, 139);
    rect(gameChar_x - 4, gameChar_y - 10, 5, 10);
    rect(gameChar_x + 4, gameChar_y - 10, 5, 10);
  } else if (isFalling || isPlummeting) {
    // jumping facing forwards code
    stroke(2);
    strokeWeight(0.57);
    fill(255, 140, 0);
    triangle(
      gameChar_x,
      gameChar_y - 50,
      gameChar_x - 20,
      gameChar_y - 10,
      gameChar_x + 20,
      gameChar_y - 10
    );
    noStroke();

    //Eyes

    fill(255);
    ellipse(gameChar_x - 5, gameChar_y - 25, 10);
    ellipse(gameChar_x + 5, gameChar_y - 25, 10);
    fill(0);
    ellipse(gameChar_x - 5, gameChar_y - 25, 5);
    ellipse(gameChar_x + 5, gameChar_y - 25, 5);

    //Mouth
    fill(0);
    ellipse(gameChar_x, gameChar_y - 16, 3);

    //Legs
    fill(72, 61, 139);
    rect(gameChar_x - 4, gameChar_y - 10, 5, 6);
    rect(gameChar_x + 4, gameChar_y - 10, 5, 6);

    //Hands
    stroke(0);
    strokeWeight(3);
    line(gameChar_x - 15, gameChar_y - 20, gameChar_x - 17, gameChar_y - 40);
    line(gameChar_x + 15, gameChar_y - 20, gameChar_x + 17, gameChar_y - 40);
    strokeWeight(1);
  } else {
    //standing front facing code
    stroke(2);
    strokeWeight(0.57);
    fill(255, 140, 0);
    triangle(
      gameChar_x,
      gameChar_y - 50,
      gameChar_x - 20,
      gameChar_y - 10,
      gameChar_x + 20,
      gameChar_y - 10
    );
    noStroke();

    //Eyes

    fill(255);
    ellipse(gameChar_x - 5, gameChar_y - 25, 10);
    ellipse(gameChar_x + 5, gameChar_y - 25, 10);
    fill(0);
    ellipse(gameChar_x - 5, gameChar_y - 25, 5);
    ellipse(gameChar_x + 5, gameChar_y - 25, 5);

    //Mouth
    fill(0);
    ellipse(gameChar_x, gameChar_y - 16, 3);

    //Legs
    fill(72, 61, 139);
    rect(gameChar_x - 4, gameChar_y - 10, 5, 10);
    rect(gameChar_x + 4, gameChar_y - 10, 5, 10);
  }
}
