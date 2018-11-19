window.onload = function() {
  var canvas = $("#game")[0];
  var ctx = canvas.getContext("2d");
  var frameCounter = 0;
  var candyArray = []; // mehrere Arrays für jeweils candy, apple und carrot
  var carrotArray = [];
  var appleArray = [];
  var score = 0;

  //images
  var img = new Image(); // Create new img element
  img.src = "images/CV_Vampi_01.png"; // Set source path

  var imgSad = new Image();
  imgSad.src = "images/CV_Vampi_Sad_01.png";

  var imgCandy = new Image(); //jeweils die images für candy, apple und carrot
  imgCandy.src = "images/CV_Cupcake_01.png";

  var imgCarrot = new Image();
  imgCarrot.src = "images/CV_Carrot_02.png";

  var imgApple = new Image();
  imgApple.src = "images/CV_Apple_01.png";

  var imgHeart = new Image();
  imgHeart.src = "images/Heart_01.png";

  //create monster
  var monster = {
    x: 260,
    y: 490,
    height: 97,
    width: 138,
    moveLeft: function() {
      if (this.x > 0) {
        this.x -= 10;
      }
    },
    moveRight: function() {
      if (this.x < 500) {
        this.x += 10;
      }
    }
  };

  // A MonsterFood item adds or removes score points when the monster touches it
  class MonsterFood {
    constructor(height, width, image, points) {
      this.x = Math.floor(Math.random() * canvas.width - 100);
      this.y = Math.floor(Math.random() * -100);
      this.counted = false;
      this.height = height;
      this.width  = width;
      this.points = points;
      this.image  = image;

      this.is_healthy = function() {
        return this.points < 0;
      };
    }
  }

  //create candy
  class Candy {
    constructor() {
      this.x = Math.floor(Math.random() * canvas.width - 100);
      this.y = Math.floor(Math.random() * -100);
      this.height = 40;
      this.width = 50;
      this.counted = false;
      // this.points = 1;
    }
  }

  //create carrot
  class Carrot {
    constructor() {
      this.x = Math.floor(Math.random() * canvas.width - 100); // -100 (Breite des Bildes) weil sonst außerhalb des Bildrandes
      this.y = Math.floor(Math.random() * -100);
      this.height = 50;
      this.width = 80;
      this.counted = false;
      // this.points = -1;
    }
  }

  //create apple
  class Apple {
    constructor() {
      this.x = Math.floor(Math.random() * canvas.width - 100); // -100 (Breite des Bildes) weil sonst außerhalb des Bildrandes
      this.y = Math.floor(Math.random() * -100);
      this.height = 50;
      this.width = 50;
      this.counted = false;
      // this.points = -1;
    }
  }

  document.getElementById("start-button").onclick = function() {
    // TO DO: Spielername + Charakter auswählen

    ctx.drawImage(img, monster.x, monster.y, monster.height, monster.width);
    ctx.strokeRect(monster.x, monster.y, monster.height, monster.width);
    startGame();
    window.requestAnimationFrame(updateCanvas);
  };

  function startGame() {
    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 37:
          monster.moveLeft();
          //console.log("left", monster);
          break;
        case 39:
          monster.moveRight();
          //console.log("right", monster);
          break;
      }
    };
    playMusic(); //hier wird die Musik bei Spielstart gestartet - ist im HTML Code drin
  }
  //Funktion um Music zu spielen
  function playMusic() {
    music.play();
  }

  function updateCanvas() {
    ctx.clearRect(0, 0, 600, 650);
    ctx.drawImage(img, monster.x, monster.y, monster.height, monster.width);
    //ctx.strokeRect(monster.x, monster.y, monster.height, monster.width);
    //Hatte ich eingefügt als Box um die Candy, Apple, Carrots, um zu sehen wann das Monster getroffen wird
    ctx.drawImage(imgHeart, 400, 15, 30, 30);
    ctx.drawImage(imgHeart, 440, 15, 30, 30);
    ctx.drawImage(imgHeart, 480, 15, 30, 30);
    ctx.drawImage(imgHeart, 520, 15, 30, 30);
    ctx.drawImage(imgHeart, 560, 15, 30, 30);
    frameCounter++;

    if (frameCounter % 130 == 0) {
      var candy = new Candy();
      candyArray.push(candy);
    }
    for (var i = 0; i < candyArray.length; i++) {
      ctx.drawImage(
        imgCandy,
        candyArray[i].x,
        (candyArray[i].y += 1),
        candyArray[i].height,
        candyArray[i].width
      );
      // ctx.strokeRect( Box um zu sehen wo Monster und Candy sich berühren
      //   candyArray[i].x,
      //   (candyArray[i].y += 1),
      //   candyArray[i].height,
      //   candyArray[i].width
      // );
    }
    if (frameCounter % 200 == 0) {
      carrotArray.push(new MonsterFood(50, 80, imgCarrot, -1));
    }
    for (var i = 0; i < carrotArray.length; i++) {
      var carrot = carrotArray[i];
      ctx.drawImage(
        carrot.image,
        carrot.x,
        (carrot.y += 2),
        carrot.height,
        carrot.width
      );
      // ctx.strokeRect(
      //   carrotArray[i].x,
      //   (carrotArray[i].y += 1),
      //   carrotArray[i].height,
      //   carrotArray[i].width
      // );
    }

    //hier wird der Apfel eingefügt
    if (frameCounter % 120 == 0) {
      var apple = new Apple();
      appleArray.push(apple);
    }
    for (var i = 0; i < appleArray.length; i++) {
      ctx.drawImage(
        imgApple,
        appleArray[i].x,
        (appleArray[i].y += 2),
        appleArray[i].height,
        appleArray[i].width
      );
      // ctx.strokeRect(
      //   appleArray[i].x,
      //   (appleArray[i].y += 1),
      //   appleArray[i].height,
      //   appleArray[i].width
      // );
    }

    crashCandy();
    crashApple();
    crashCarrot();
    $(".game-score").text(score);
    window.requestAnimationFrame(updateCanvas);
  }

  function crashCandy() {
    for (var i = 0; i < candyArray.length; i++) {
      var candy = candyArray[i];
      if (intersect(monster, candy)) {
        ctx.drawImage(img, monster.x, monster.y, monster.height, monster.width);

        // ctx.strokeRect(monster.x, monster.y, monster.height, monster.width);
        if (!candy.counted) {
          score = score + 1;
          candy.counted = true;
          yay.play(); // positiver Sound wird abgespielt wenn Monster candy bekommt
        }
      }
    }
  }

  function crashApple() {
    //var score = 0;
    for (var i = 0; i < appleArray.length; i++) {
      var apple = appleArray[i];
      if (intersect(monster, apple)) {
        ctx.drawImage(
          imgSad,
          monster.x,
          monster.y,
          monster.height,
          monster.width
        );
        // ctx.strokeRect(monster.x, monster.y, monster.height, monster.width);
        //huh.play();
        if (!apple.counted) {
          score = score - 1;
          apple.counted = true;
        }
        //console.log(score);
      }
    }
  }

  function crashCarrot() {
    //var score = 0;
    for (var i = 0; i < carrotArray.length; i++) {
      var carrot = carrotArray[i];
      if (intersect(monster, carrot)) {
        ctx.drawImage(
          imgSad,
          monster.x,
          monster.y,
          monster.height,
          monster.width
        );
        // ctx.strokeRect(monster.x, monster.y, monster.height, monster.width);
        if (!carrot.counted) {
          score += carrot.points;
          // score = score + carrot.points;
          carrot.counted = true;
          huh.play();
        }
      }
      //console.log(score);
    }
  }

  function intersect(monster, object) {
    var monsterleft = monster.x;
    var monstertop = monster.y;
    var monsterright = monster.x + monster.width;
    var monsterbottom = monster.y + monster.height;

    var objectleft = object.x;
    var objecttop = object.y;
    var objectright = object.x + object.width;
    var objectbottom = object.y + object.height;
    return !(
      monsterleft > objectright ||
      monsterright < objectleft ||
      monstertop > objectbottom ||
      monsterbottom < objecttop
    );
  }
};
