var sky,skyImg;
var dragonImg,dragon,endDragonImg;
var monsterImg,monster,monsterGroup;
var heartImg,heart;
var fireBallImg,fireBall;
var gameoverImg,gameOver;
var obstacle1Img,obstacle2Img,obstacle3Img;
var upObstacleGroup,midObstacleGroup,downObstacleGroup;
var upObstacle,midObstacle,downObstacle;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = 1;
var sparkelLine;
var line;
var flappingSound,heartSound,hitSound,hitSound2,increaseSize,outSound,monsterSound,bgSound;
var great,greatImg;


function preload(){

//loading images
  skyImg = loadImage("assests/combinedsky.png");
  dragonImg = loadAnimation("assests/Dragon1.png","assests/Dragon2.png","assests/Dragon3.png");
  monsterImg = loadAnimation("assests/enemy1.png","assests/enemy2.png");
  heartImg = loadImage("assests/points.png");
  fireBallImg = loadImage("assests/fire.png");
  gameoverImg =  loadImage("assests/gameover.png");
  obstacle1Img = loadImage("assests/obstacle1.png");
  obstacle2Img = loadImage("assests/obstacle2.png");
  obstacle3Img = loadImage("assests/obstacle3.png");
  endDragonImg = loadAnimation("assests/dragon4.png");
  sparkelLine = loadImage("assests/sparkel_line.png");
  greatImg = loadImage("assests/great.png");
  // twoImg = loadImage("assests/2x.png");
  // threeImg = loadImage("assests/3x.png");

//loading sounds
  flappingSound = loadSound("flappingSound.mp3");
  heartSound = loadSound("heartSound.mp3");
  hitSound = loadSound("hit2.mp3");
  hitSound2 = loadSound("hit1.mp3");
  increaseSize = loadSound("increasing size.mp3");
  outSound = loadSound("gameOverSound.mp3");
  monsterSound = loadSound("monsterSound.mp3");
  bgSound = loadSound("bgSound.mp3");
}

function setup() {
  createCanvas(800,400);

//adding bg
  sky = createSprite(400, 200, 50, 50);
  sky.addImage(skyImg);
  sky.scale = 0.7;

//creating dragon
  dragon = createSprite(70, 200, 50, 50);
  dragon.addAnimation("flyingDragon",dragonImg);
  dragon.addAnimation("end_dragon",endDragonImg);

//creating line
  line = createSprite(130,200,2,400);
  line.addImage(sparkelLine);
  line.scale = 0.5;

//creating groups
  upObstacleGroup = new Group();
  midObstacleGroup = new Group();
  downObstacleGroup = new Group();
  heartGroup = new Group();
  monsterGroup = new Group();

//creating invisible gameover sprite
  gameOver = createSprite(400,200,60,20);
  gameOver.addImage(gameoverImg);
  gameOver.visible = false;

//creating invisible great sprite
  great = createSprite(400,200,60,20);
  great.addImage(greatImg);
  great.visible = false;
  great.scale = 0.5;

//decreasing the colliding area of sprites
  dragon.setCollider("circle",0,0,20);
  line.setCollider("rectangle",0,-15,15,800);
  //line.debug = true;

//creating invisible two sprite
  // two = createSprite(400,200,60,20);
  // two.addImage(greatImg);
  // two.visible = false;

//console.log(monsterGroup);

}

function draw() {
  background("black"); 

//making gamestate = to play
  if(gameState===PLAY){

    if (!bgSound.isPlaying() ){
      bgSound.play();
    }

  //moving the dragon 
    if(keyDown("UP_ARROW")){
      dragon.y -= 5;
    }
  
    if(keyDown("DOWN_ARROW")){
      dragon.y += 5;
    }
  
  //making the bg moving continuous
    if(sky.x <= 250){
      sky.x = width/2;
    }
  
  //moving the bg 
    sky.velocityX = -3;
  
    //console.log(heartGroup.length)

  //displaying hearts after every 249 frames & destroying one heart at a time  
   if(frameCount > 249){
    for(var j=0; j<heartGroup.length; j++){
      if(heartGroup[j].isTouching(dragon)){
        heartGroup[j].destroy();
        score = score+1;
        heartSound.play();
        //console.log("test")
      }
    }
  }

  //destroying monster with the help of fireballs
    if(fireBall){
    if(monsterGroup.isTouching(fireBall)){
      monsterGroup.destroyEach();
      fireBall.destroy();
      score = score + 5
      hitSound2.play();
    }
  }

  //calling functions
    spawnHearts(); 
    spawnUpObstacle();
    spawnMonster();

  //ending the game if dragon is touching the line
    if(monsterGroup != undefined){
    if(monsterGroup.isTouching(line)){
      monsterSound.play();
      gameState = END;
    }
  }

  //ending the game if dragon is touching the obstacles & going out of the canvas
    if(upObstacleGroup.isTouching(dragon) ||dragon.y<1||dragon.y>400){
      gameState = END;
      outSound.play();
    }

  //releasing fireballs  
    if(keyWentDown("SPACE")){
      fireBall = createSprite(70, dragon.y, 50, 50);
      fireBall.addImage(fireBallImg);
      fireBall.velocityX = 5
      hitSound.play();
    }

  //incresing the sound of dragon when score=50 & playing sound  
    if(score===50){
    
      dragon.scale = 1.2;
      
      if (!increaseSize.isPlaying() ){
        increaseSize.play();
      }
    }

  //increasing the score by 1 so that the increaseSize sound dont keeps on playing  
    if(score===50){
      score = score+1;
    }

  //making the great sprite visible and invisible when score is between 49 to 55  
    if(score>49 && score<53){
      great.visible = true;
    }

    if(score>99 && score<103){
      great.visible = true;
    }

    if(score>103){
      great.visible = false;
    }

    if(score>53){
      great.visible = false;
    }

  //increasing the speed when score>50  
    if(score>50){
      upObstacleGroup.setVelocityXEach(-4);
    midObstacleGroup.setVelocityXEach(-4);
    downObstacleGroup.setVelocityXEach(-4);
    heartGroup.setVelocityXEach(-4);
    monsterGroup.setVelocityXEach(-6);
    sky.velocityX = -4;
    }

  //increasing the speed when score>100
    if(score>100){
      upObstacleGroup.setVelocityXEach(-5);
    midObstacleGroup.setVelocityXEach(-5);
    downObstacleGroup.setVelocityXEach(-5);
    heartGroup.setVelocityXEach(-5);
    monsterGroup.setVelocityXEach(-7);
    sky.velocityX = -5;
    }

  //increasing the speed when score>150  
    if(score>150){
      upObstacleGroup.setVelocityXEach(-6);
    midObstacleGroup.setVelocityXEach(-6);
    downObstacleGroup.setVelocityXEach(-6);
    heartGroup.setVelocityXEach(-6);
    monsterGroup.setVelocityXEach(-8);
    sky.velocityX = -6;
    }
     //console.log(monsterGroup[0])
  }



  drawSprites();

  
  //displaying score
    stroke("black");
    fill("white");
    textSize(20);
    text("Score:"+score,350,35);

  //creating end state
    if(gameState===END){

    //changing the image of the dragon  
      dragon.changeAnimation("end_dragon",endDragonImg);

    //making every sprite stop  
      sky.velocityX = 0;
      dragon.velocityX = 0;
      dragon.velocityY = 0; 

    //making every group stop  
      upObstacleGroup.setVelocityXEach(0);
      midObstacleGroup.setVelocityXEach(0);
      downObstacleGroup.setVelocityXEach(0);
      heartGroup.setVelocityXEach(0);

    //making gameover visible  
      gameOver.visible = true;
      
    //destroying all the monsters  
      monsterGroup.destroyEach();
    
    //displaying text to restart  
      stroke("red");
      fill("red");
      text("Press R to restart",310,285);

    //making gameover invisible  
      great.visible = false;

    //reseting the game when r is pressed  
      if(keyIsDown(82)){
        reset();
      }
    }
}

//group of hearts
   function spawnHearts(){

  //displaying hearts after every 250 frame  
    if(frameCount % 250===0){
    
    //creating hearts outside the canvas  
      var x = 850;
    
    //giving random y position  
      var y = Math.round(random(50,250));

    //arranging hearts in a 1st half curved line  
      for(var i=1, j=10; i<6; i++, j-=8){

        heart = createSprite(x,y,10,10);
        heart.addImage(heartImg);
        heart.velocityX = -3;

        x += 20-j
        y += 20+j

      //adding hearts in group  
        heartGroup.add(heart);
      }

  //arranging hearts in a 2nd half curved line
    for(var i=1, j=-10; i<6; i++, j+=5){

      heart = createSprite(x,y,10,10);
      heart.addImage(heartImg);
      heart.velocityX = -3;

      x+=20-j;
      y-=20+j;

    //adding hearts in group
      heartGroup.add(heart);
    }
      
      // heart = createSprite(850,random(80,275));
      // heart.addImage(heartImg);
      // heart.velocityX = -3;
      // gameOver.depth = heart.depth+1;
      // // if(fireBall)
      // // fireBall.depth = heart.depth + 1;
      // heartGroup.add(heart);
    }
  }

  
//group of obstacle
  function spawnUpObstacle(){

  //displaying obstacle after evry 200 frame   
    if(frameCount % 200===0){
      
      upObstacle = createSprite(850,80,70,100);
      upObstacle.velocityX = -3;
      
      
    //displaying different images at diff positions  
      var rand = Math.round(random(1,3));

      if(rand === 1){
        upObstacle.y = 80;
        upObstacle.addImage(obstacle1Img);
        upObstacle.scale = 1.65;
        upObstacle.setCollider("rectangle",0,20,70,30);
        
      } else if(rand === 2){
        upObstacle.y = Math.round(random(150,250));
        upObstacle.addImage(obstacle3Img);
        upObstacle.scale = 2;
        upObstacle.setCollider("rectangle",0,0,60,30);
      } else{
        upObstacle.y = 275;
        upObstacle.addImage(obstacle2Img);
        upObstacle.scale = 1.65;
        upObstacle.setCollider("rectangle",0,-15,70,40);
      }
      
    //displaying gameover image above obstacles 
      gameOver.depth = upObstacle.depth+1;
     
     //fireBall.depth = upObstacle.depth + 1;
      upObstacleGroup.add(upObstacle);

    //displaying dragon above obstacles  
      dragon.depth += upObstacle.depth;

    //displaying great above obstacles  
      great.depth += upObstacle.depth;
    }
  }

//group monsters  
  function spawnMonster(){

  //displaying monsters after every 250 frame  
    if(frameCount % 250===0){

      monster = createSprite(850,random(80,275));
      monster.addAnimation("flying_monster",monsterImg);
      monster.velocityX = -5;
      monster.scale = 0.3;

    //displaying gameover above monster  
      gameOver.depth = monster.depth+1;
      monster.setCollider("circle",0,0,40);
    
      great.depth = monster.depth+1;
      monsterGroup.add(monster);
    }
  }

//things happen after pressing R   
  function reset(){

    gameState = PLAY;

    score = 0;

    upObstacleGroup.destroyEach();
    downObstacleGroup.destroyEach();
    midObstacleGroup.destroyEach();
    heartGroup.destroyEach();

    gameOver.visible = false;

    dragon.changeAnimation("flyingDragon",dragonImg);
    dragon.y = 200;
    dragon.scale = 1;

    upObstacleGroup.setVelocityXEach(-3);
    midObstacleGroup.setVelocityXEach(-3);
    downObstacleGroup.setVelocityXEach(-3);
    heartGroup.setVelocityXEach(-3);
    monsterGroup.setVelocityXEach(-5);
  }
  
