//liberies
//sprite : https://molleindustria.github.io/p5.play/docs/classes/Sprite.html
//p5 : https://p5js.org/reference/#/p5/text

//declaring varibles
var trex, trexAnimation, trexCollided;
var ground, groundImage;
var isvisibleGround;
var clouds, cloudImage;
var obstacles,
  obstacleImage1,
  obstacleImage2,
  obstacleImage3,
  obstacleImage4,
  obstacleImage5,
  obstacleImage6;
var play = 0;
var end = 1;
var cloudsGroup, ObstaclesGroup;
var score = 0
var gameOver, gameOverImage
var restart, restartImage
var checkpoint
var die
var jump

var gamestate = play;


//used to upload assets
function preload() {
  trexAnimation = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacleImage1 = loadImage("obstacle1.png");
  obstacleImage2 = loadImage("obstacle2.png");
  obstacleImage3 = loadImage("obstacle3.png");
  obstacleImage4 = loadImage("obstacle4.png");
  obstacleImage5 = loadImage("obstacle5.png");
  obstacleImage6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  trexCollided = loadAnimation("trex_collided.png")
  checkpoint = loadSound("checkpoint.mp3")
  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3")
}
//used to create objects one time
function setup() {
  createCanvas(600, 200);
  trex = createSprite(30, 165, 50, 50);
  trex.addAnimation("trex", trexAnimation);
  trex.addAnimation("collided", trexCollided)
  trex.scale = 0.4;

  ground = createSprite(300, 180, 600, 10);
  ground.addImage("floor", groundImage);

  isvisibleGround = createSprite(300, 185, 600, 10);
  isvisibleGround.visible = false;

  gameOver = createSprite(300, 100)
  gameOver.scale = 0.7
  gameOver.addImage("GameOver", gameOverImage)

  restart = createSprite(300, 125)
  restart.scale = 0.3
  restart.addImage("restartButton", restartImage)

  // creating group
  cloudsGroup = new Group();
  ObstaclesGroup = new Group();
  trex.debug = true
  //trex.setCollider("rectangle",0,0,120,100)
  trex.setCollider("circle", 0, 0, 40)
}
//used to display and hive instructions to objects multiple times

function draw() {
  background("black");
  drawSprites();

  if (gamestate === play) {
    gameOver.visible = false
    restart.visible = false
    ground.velocityX = -(4 + score / 100);
    createClouds();
    createObstacles();
    //score = score + Math.round(frameCount % 10 === 0)
    score = score + Math.round(frameCount / 190)
    if (keyDown("space") && trex.y >= 164) {
      trex.velocityY = -10;
      jump.play()
    } else if (keyDown("up") && trex.y >= 164) {
      trex.velocityY = -10;
      jump.play()
    }

    //infinite ground
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //gravity to trex
    trex.velocityY = trex.velocityY + 0.5;
    // switching to end state
    if (ObstaclesGroup.isTouching(trex)) {
      trex.changeAnimation("collided", trexCollided)
      gamestate = end;
      die.play()
    }
    if (score % 300 === 0 && score > 0) {
      checkpoint.play()

    }
  } else if (gamestate === end) {
    ground.velocityX = 0;
    trex.velocityY = 0;

    gameOver.visible = true
    restart.visible = true

    cloudsGroup.setVelocityXEach(0)
    ObstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setLifetimeEach(-1)
    ObstaclesGroup.setLifetimeEach(-1)

    if (mousePressedOver(restart)) {
      restartGame()
    }
  }
  //collide
  trex.collide(isvisibleGround);
  text("Score: " + score, 200, 50)
  //check y position
  console.log(trex.y)
  //check frame count
  //console.log("frame count"+ frameCount)
  //console.log(Math.round(random(100,200)))
  //console.log(Math.ceil(8.99))
  //console.log("trex depth is:" + trex.depth);
  //console.log("clouds depth is:" + clouds.depth);

  text(mouseX + "," + mouseY, mouseX, mouseY);
  //calling userdefined function
}

function createClouds() {
  if (frameCount % 200 === 0) {
    clouds = createSprite(590, 35, 100, 10);
    clouds.addImage("cloud", cloudImage);
    clouds.scale = Math.random(0.3, 0.4);
    clouds.velocityX = -1;
    clouds.y = Math.round(random(35, 120));

    trex.depth = clouds.depth;
    trex.depth += 1;


    //lifetime= distance/speed
    //clouds.lifetime= 590/2 =295

    clouds.lifetime = 590;

    cloudsGroup.add(clouds);
  }
}

function createObstacles() {
  if (frameCount % 60 === 0) {
    obstacles = createSprite(580, 165, 10, 80);
    obstacles.velocityX = -(4 + score / 1000);
    obstacles.lifetime = 145;
    obstacles.scale = 0.4;
    var number = Math.round(random(1, 6));
    ObstaclesGroup.add(obstacles);

    switch (number) {
      case 1:
        obstacles.addImage(obstacleImage1);
        break;
      case 2:
        obstacles.addImage(obstacleImage2);
        break;
      case 3:
        obstacles.addImage(obstacleImage3);
        break;
      case 4:
        obstacles.addImage(obstacleImage4);
        break;
      case 5:
        obstacles.addImage(obstacleImage5);
        break;
      case 6:
        obstacles.addImage(obstacleImage6);
        break;
      default:
        break;
    }
  }

  //   if(frameCount % 200 === 0){
  //  obstacles.velocityX -= 1
  //   }
}


function restartGame() {
  trex.changeAnimation("trex", trexAnimation)
  score = 0
  ObstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  gamestate = play
}
