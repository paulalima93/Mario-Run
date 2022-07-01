var mario, marioCorrendo, marioPulando, marioPerdeu;
var ground, groundImage, invisbleGround;
var nuvem, nuvemImagem1, nuvemImagem2;
var obstaculo;
var obstaculoImagem1, obstaculoImagem2,
    obstaculoImagem3, obstaculoImagem4;
  

var score = 0;

var grupodenuvens, grupodeobstaculos;
var gameState = "play";

var gameOver, gameOverImagem, restart, restartImagem;

var jumpSound, dieSound, checkPointSound;

function preload(){
  marioCorrendo = loadAnimation("img/marioCorrendo0.png","img/marioCorrendo1.png","img/marioCorrendo2.png");
  marioPulando= loadAnimation("img/marioPulo.png");
  marioPerdeu = loadAnimation("img/marioPerdeu.png");

  groundImage = loadImage("img/ground.png");
  nuvemImagem1 = loadImage("img/nuvem1.png");
  nuvemImagem2 = loadImage("img/nuvem2.png");
  obstaculoImagem1 = loadImage("img/obstaculo1.png");
  obstaculoImagem2 = loadImage("img/obstaculo2.png");
  obstaculoImagem3 = loadImage("img/obstaculo3.png");
  obstaculoImagem4 = loadImage("img/obstaculo4.png");

  
  gameOverImagem = loadImage("img/gameOver.png");
  restartImagem = loadImage("img/restart.png");
 

  jumpSound = loadSound("som/jump.mp3");
  dieSound = loadSound("som/die.mp3");
  checkPointSound = loadSound("som/checkPoint.wav");

}

function setup(){
  createCanvas(600,200);

  ground = createSprite(300,190,600,10);
  ground.addImage(groundImage);

  mario = createSprite(50,175,40,60);
  mario.addAnimation("correndo", marioCorrendo);
  mario.addAnimation("pulo", marioPulando);
  mario.addAnimation("morreu", marioPerdeu);

  invisbleGround = createSprite(300,178,600,5);
  invisbleGround.visible = false;

  grupodenuvens = new Group();
  grupodeobstaculos = new Group();



  gameOver = createSprite(300,50);
  gameOver.addImage(gameOverImagem);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  

  restart = createSprite(300,100);
  restart.addImage(restartImagem);
  restart.scale = 0.04;
  restart.visible = false;
 

}

function draw(){
  background("skyblue");
  fill("white")
  text("Pontuação: " + score, 500,50);
  
  if (gameState === "play") {
     score = score + Math.round(frameRate()/60);

      
     
    if (touches.length > 0 ||keyDown("space") && mario.y >100) {
      mario.velocityY = -10; 
      mario.scale = 0.2;
      //trocar para animação do pulo
      //tocar som do pulo
     touches = [];
      mario.changeAnimation("pulo")
      jumpSound.play();
    }

    if(mario.y >= 130) {
      mario.changeAnimation("correndo");
      mario.scale = 0.15;
    }

    if(score>0 && score%100===0){
     checkPointSound.play();
    }

     ground.velocityX = -4;

    if (ground.x<0) {
    ground.x = ground.width/4;
    }

    criarNuvens();
    criarobstaculos();

    if(mario.isTouching(grupodeobstaculos)){
     gameState = "end";
     dieSound.play();
     //tocar som gameover
     
    }

  } 
else if(gameState === "end") {

    ground.velocityX = 0;
    grupodeobstaculos.setVelocityXEach(0);
    grupodenuvens.setVelocityXEach(0);

    grupodenuvens.setLifetimeEach(-1);
    grupodeobstaculos.setLifetimeEach(-1);

    //mudar animaçao do mario quando perde
   
  mario.changeAnimation("morreu")
  mario.scale = 0.8
    //colocar visivel o gameover e o reset
  gameOver.visible = true;
  restart.visible = true;
  
   if(mousePressedOver(restart)){
   reset();
   
}
  
   
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
    

  }

  mario.velocityY +=0.5;
  mario.collide(invisbleGround);
  drawSprites();
}        

function reset(){
  gameState = "play";
  
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  
  gameOver.visible = false;
  restart.visible = false;
}

function criarNuvens(){
  if (frameCount%80===0) {
    nuvem = createSprite(600, 100, 20,10);
    nuvem.velocityX = -4;
    
    nuvem.scale = 0.15;
    nuvem.y = Math.round(random(20,120));
    nuvem.lifetime= 160;

    var aleatorio = Math.round(random(1,2));

    if (aleatorio === 1) {
      nuvem.addImage(nuvemImagem1);
    } else if(aleatorio === 2) {
      nuvem.addImage(nuvemImagem2);
    }

    mario.depth = nuvem.depth;
    mario.depth += 1;
    
    gameOver.depth = nuvem.depth;
    gameOver.depth += 1;
    
    restart.depth = nuvem.depth;
    restart.depth += 1;

    grupodenuvens.add(nuvem);
  }
  
}

 function criarobstaculos() {
  if(frameCount%90===0) {
    obstaculo = createSprite(600,175,20,30);
    obstaculo.velocityX = -4;
    obstaculo.scale = 0.5; 
    obstaculo.lifetime = 160;

    grupodeobstaculos.add(obstaculo);

    var aleatorio = Math.round(random(1,4));

    switch (aleatorio) {
      case 1: 
        obstaculo.addImage(obstaculoImagem1);
        obstaculo.scale = 1.5;
        obstaculo.y = 150;
        break;
      case 2: 
        obstaculo.addImage(obstaculoImagem2);
        obstaculo.scale = 1.5;
        obstaculo.y = 165; 
        break;
      case 3: 
        obstaculo.addImage(obstaculoImagem3);
        obstaculo.scale = 1.5;
        obstaculo.y =  Math.round(random(100,150)); 
        obstaculo.velocityX = -6
        break;
      case 4: 
        obstaculo.addImage(obstaculoImagem4);
        obstaculo.scale = 0.8;
        obstaculo.y = 140;
        obstaculo.velocityX = -6
        break;


      default:
        break;
    }

  }
}
