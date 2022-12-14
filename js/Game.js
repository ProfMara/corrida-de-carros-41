class Game {
  constructor() {
    this.resetarTitulo = createElement("h2");
    this.botaoResetar = createButton("");

    this.placarTitulo = createElement("h2");

    this.lugar1 = createElement("h2");
    this.lugar2 = createElement("h2");
    this.esquerda = false;

   this.movendo = false;

  }

  pegarEstado() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }

  lerVencedores(){
    var venceRef = database.ref("vencedores");
    venceRef.on("value", function (data){
      player.rank = data.val();
    })
  }
  inscreverVencedores(quantidade){
    database.ref("/").set({
      vencedores:quantidade
    })
  }


  atualizar(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.pegarQuant();

    form = new Form();
    form.exibir();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1",carimg1);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", carimg2);
    car2.scale = 0.07;

    cars = [car1, car2];


    //criar grupos
    obsGrupo1 = new Group();
    obsGrupo2 = new Group();
    combustiveis = new Group();
    moedas = new Group();
   
   
   var obsPos = [
      { x: width / 2 - 150, y: height - 1300, image: obsImg1 },
      { x: width / 2 + 250, y: height - 1800, image: obsImg1 },
      { x: width / 2 - 180, y: height - 3300, image: obsImg1 },
      { x: width / 2 - 150, y: height - 4300, image: obsImg1 },
      { x: width / 2, y: height - 5300, image: obsImg1 },

    ];
 
    var obsPos2 = [
      { x: width / 2 + 250, y: height - 800, image: obsImg2 },
      { x: width / 2 - 180, y: height - 2300, image: obsImg2 },
      { x: width / 2, y: height - 2800, image: obsImg2 },
      { x: width / 2 + 180, y: height - 3300, image: obsImg2 },
      { x: width / 2 + 250, y: height - 3800, image: obsImg2 },
      { x: width / 2 + 250, y: height - 4800, image: obsImg2 },
      { x: width / 2 - 180, y: height - 5500, image: obsImg2 }
    ];

    
    // Adicionar sprite de combust??vel no jogo
    this.addSprites(combustiveis, 20,fuelImg, 0.02)

    // Adicionar sprite de moeda no jogo
    this.addSprites(moedas, 18, moedaImg, 0.09);

    this.addSprites(obsGrupo1, obsPos.length, obsImg1, 0.04, obsPos)

    this.addSprites(obsGrupo2, obsPos2.length, obsImg2, 0.04, obsPos2)

   
   
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, pos=[]) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;
     
      if(pos.length>0){
        x = pos[i].x;
        y = pos[i].y;
      }else{
      
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);  
      }

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);
      }
    }
  

  porElementos() {
    form.esconder();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetarTitulo.html("Reiniciar");
    this.resetarTitulo.class("resetText");
    this.resetarTitulo.position(width / 2 + 200, 40);

    this.botaoResetar.class("resetButton");
    this.botaoResetar.position(width / 2 + 230, 100);

    this.placarTitulo.html("Placar");
    this.placarTitulo.class("resetText");
    this.placarTitulo.position(width / 3 - 60, 40);

    this.lugar1.class("leadersText");
    this.lugar1.position(width / 3 - 50, 80);

    this.lugar2.class("leadersText");
    this.lugar2.position(width / 3 - 50, 130);
  }

  play() {
    this.porElementos();
    this.resetar();
    Player.pegarInfo();
   
     

    if (allPlayers !== undefined) {
      image(estrada, 0, -height * 5, width, height * 6);
      this.lerVencedores();
      this.mostrarPlacar();

      //chamar a fun????o para mostrar o combust??vel


      var i = 0;
      for (var p in allPlayers) {
 
        //use os dados do banco de dados para exibir os carros nas dire????es x e y
        var x = allPlayers[p].positionX;
        var y = height - allPlayers[p].positionY;

        cars[i].position.x = x;
        cars[i].position.y = y;
        
        var linhaChegada = height*6 - 100;

        if(player.positionY >= linhaChegada){
          player.rank++;
          player.atualizar();
          this.inscreverVencedores(player.rank);
          gameState = 2;
          this.mostrarRank();
        }
        
       //adicione 1 ao ??ndice para cada loop
        i++;
        if (i === player.index) {
          
          //chamar a fun????o que coleta moedas e combust??veis
          this.coletarMoeda(i);
          this.coletarComb(i);

          //alterar a posi????o da c??mera na dire????o y
          camera.position.y = y;
        }
      }

      

      //manipulando eventos de teclado
      this.controlarJogador();

      drawSprites();
    }
  }

  resetar() {
    this.botaoResetar.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }

  mostrarPlacar() {
    var lugar1, lugar2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1 || (players[0].rank ==1  && players[1].rank == 1)
    ) {
      // &emsp;    Essa etiqueta ?? usada para exibir quatro espa??os.
      lugar1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

        lugar2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      lugar1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

        lugar2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.lugar1.html(lugar1);
    this.lugar2.html(lugar2);
  }


  //fun????o que detecta a colis??o entre o carro e a moeda
  coletarMoeda(i){

    cars[i-1].overlap(moedas, function(coletor, coletado){
      coletado.remove();
      player.score +=30;
      player.atualizar()
    })

  }

  //fun????o para detectar a colis??o entre o carro e o combust??vel

coletarComb(i){
    //c??digo para detectar a colis??o entre os carros e os combust??veis

    cars[i-1].overlap(combustiveis, function(coletor, coletado){
      coletado.remove();
      player.fuel = 160;
      player.atualizar();
    });

    //c??digo para verificar se est??o se movendo e diminuir a quantidade de combust??vel

    
    //c??digo para verificar se o combust??vel do player ?? menor que 0 para terminar o jogo


}
  

  //mostrar barra de combust??vel




  
  mostrarRank() {
    swal({
      title: `Incr??vel!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Voc?? alcan??ou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver(){
    swal({
      title: `Fim de jogo!`,
      text: "Oopss voc?? perdeu a corrida",
      imageUrl: "https://i.postimg.cc/V5ydXyqj/deslike.png",
      imageSize: "100x100",
      confirmButtonText:"Obrigado por Jogar"

    })
  }


  controlarJogador() {
   

      if (keyIsDown(UP_ARROW)) {
        this.movendo = true;
        player.positionY += 10;
        player.atualizar();
      }
  
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        player.positionX -= 5;
        player.atualizar();
      }
  
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        player.positionX += 5;
        player.atualizar();
      }
    
  }


}
