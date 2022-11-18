var canvas;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2;
var cars = [];

var cenario, carimg1,carimg2, estrada;
var combustivelImg, moedaImg;
var obsImg1, obsImg2;
var vidaImg; 
var combustiveis, moedas, obsGrupo1, obsGrupo2;


function preload() {
  cenario = loadImage("./assets/planodefundo.png");
  carimg1 = loadImage("./assets/car1.png");
  carimg2 = loadImage("../assets/car2.png");

  obsImg1 = loadImage("/assets/obs1.png");
  obsImg2 = loadImage("/assets/obs2.png");
  
  vidaImg = loadImage("/assets/life.png");
  estrada = loadImage("../assets/pista.png");
  fuelImg = loadImage("./assets/fuel.png");
  moedaImg = loadImage("./assets/goldCoin.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.pegarEstado();
  game.start();
}

function draw() {
  background(cenario);
  if (playerCount === 2) {
    game.atualizar(1);
  }
    if(gameState==1){
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
