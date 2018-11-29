window.onload = function() {
  $("#addLife").hide();
  $("#player-name").hide();

  var canvas = $("#game")[0];
  var ctx = canvas.getContext("2d");
  var frameCounter = 0;
  var candyArray = []; // mehrere Arrays für jeweils candy, apple und carrot
  var carrotArray = [];
  var appleArray = [];
  var heartsArray = [];
  var specialArray = [];
  var score = 0;
  var gameDone = false;

  function gameOver() {
    gameDone = true;
    ctx.font = "90px haunted";
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText("Game Over", 15, canvas.height / 2);
    gameover.play();
    music.pause();
  }

  function gameWon() {
    gameDone = true;
    ctx.font = "100px haunted";
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText("You Win!", 45, canvas.height / 2);
    catchspecial.play();
    music.pause();
  }

  //images
  var happyMonster = new Image(); // Create new img element
  happyMonster.src = 0;
  // "images/CV_Vampi_01.png"; // Set source path
  var img = happyMonster; // happymonster

  var imgSad = new Image();
  imgSad.src = 0;
  // "images/CV_Vampi_Sad_01.png";

  var imgCandy = new Image(); //images for candy, apple and carrot
  imgCandy.src = "images/CV_Cupcake_01.png";

  var imgCarrot = new Image();
  imgCarrot.src = "images/CV_Carrot_02.png";

  var imgApple = new Image();
  imgApple.src = "images/CV_Apple_02.png";

  var imgHeart = new Image();
  imgHeart.src = "images/Heart_01.png";

  var imgSpecial = new Image();
  imgSpecial.src = 0;

  //create monster
  var monster = {
    lives: 5,
    x: 260,
    y: 490,
    height: 97,
    width: 138,
    moveLeft: function() {
      if (this.x > 0) {
        this.x -= 20;
      }
    },
    moveRight: function() {
      if (this.x < 500) {
        this.x += 20;
      }
    }
  };

  // class MonsterFood {
  //   constructor(height, width, image, kind, points) {
  //     this.x = Math.floor(Math.random() * canvas.width - 100);
  //     this.y = Math.floor(Math.random() * -100);
  //     this.counted = false;
  //     this.height = height;
  //     this.width = width;
  //     this.points = points;
  //     this.image = image;
  //     this.kind = kind;
  //     this.is_healthy = function() {
  //       return this.points < 0;
  //     };
  //   }
  // }
  //create heart
  class Heart {
    constructor() {
      (this.x = 360), (this.y = 15), (this.width = 30), (this.height = 30);
    }
  }
  var heart = new Heart();
  //create candy
  class Candy {
    constructor() {
      this.x = Math.floor(Math.random() * canvas.width - 40);
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
      this.x = Math.floor(Math.random() * canvas.width - 50); // -100 (Breite des Bildes) weil sonst außerhalb des Bildrandes
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
      this.x = Math.floor(Math.random() * canvas.width - 50); // -100 (Breite des Bildes) weil sonst außerhalb des Bildrandes
      this.y = Math.floor(Math.random() * -100);
      this.height = 50;
      this.width = 50;
      this.counted = false;
      // this.points = -1;
    }
  }

  //create Special
  class Special {
    constructor() {
      this.x = Math.floor(Math.random() * canvas.width - 50); // -100 (Breite des Bildes) weil sonst außerhalb des Bildrandes
      this.y = Math.floor(Math.random() * -100);
      this.height = 64;
      this.width = 92;
      this.counted = false;
    }
  }

  document.getElementById("start-button").onclick = function() {
    $("#prompt-box").show();
  };
  //pushes the character into the html and canvas
  function selectedCharacter() {
    var character = $(":radio");
    var i;
    for (i = 0; i < character.length; i++) {
      if (character[i].checked) {
        var playerCharacter = $(character[i])
          .next()
          .attr("src");
        $("#player-character").attr("src", playerCharacter);
        //happy monster on canvas
        happyMonster.src = $(character[i])
          .next()
          .attr("src");
        //sad monster on canvas
        imgSad.src = $(character[i])
          .next()
          .attr("src")
          .replace("Happy", "Sad");
        //special monster on canvas
        imgSpecial.src = $(character[i])
          .next()
          .attr("src")
          .replace("Happy", "Glow");
      }
    }
  }
  document.getElementById("submit").onclick = function() {
    var playerName = $("#playerNameInput").val();
    selectedCharacter();
    if (playerName != 0) {
      $("#player-name").show();
      $("#player-name").html(playerName);

      $("#start-button").hide();
      $("#prompt-box").hide();
      startGame();

      window.requestAnimationFrame(updateCanvas);
    } else {
      alert("You need to type your name!");
    }
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
    var live = new Heart();
    for (let i = 0; i < monster.lives; i++) {
      heartsArray.push(live);
    }
    playMusic(); //hier wird die Musik bei Spielstart gestartet - ist im HTML Code drin
  }
  //Funktion um Music zu spielen
  function playMusic() {
    music.play();
  }
  //Herzen zeichnen
  var space;
  function drawHearts() {
    space = 0;
    for (let i = 0; i < heartsArray.length; i++) {
      ctx.drawImage(imgHeart, 400 + space, 15, 30, 30);
      space += 40;
    }
  }

  function updateCanvas() {
    ctx.clearRect(0, 0, 600, 650);
    ctx.drawImage(img, monster.x, monster.y, monster.height, monster.width);
    drawHearts();
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
      // ctx.strokeRect( Box to see where monster and obstacles touch
      //   candyArray[i].x,
      //   (candyArray[i].y += 1),
      //   candyArray[i].height,
      //   candyArray[i].width
      // );
    }
    if (frameCounter % 200 == 0) {
      var carrot = new Carrot();
      carrotArray.push(carrot);
    }
    for (var i = 0; i < carrotArray.length; i++) {
      ctx.drawImage(
        imgCarrot,
        carrotArray[i].x,
        (carrotArray[i].y += 2),
        carrotArray[i].height,
        carrotArray[i].width
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

    //hier wird Special eingefügt
    if (frameCounter % 1300 == 0) {
      var special = new Special();
      specialArray.push(special);
      //$("#addLife").show();
    }
    for (var i = 0; i < specialArray.length; i++) {
      ctx.drawImage(
        imgSpecial,
        specialArray[i].x,
        (specialArray[i].y += 2),
        specialArray[i].height,
        specialArray[i].width
      );
    }

    crashCandy();
    crashApple();
    crashCarrot();
    crashSpecial();
    $("#score").text(score);
    if (!gameDone) window.requestAnimationFrame(updateCanvas);
  }

  function crashCandy() {
    if (heartsArray.length > 0) {
      for (var i = 0; i < candyArray.length; i++) {
        var candy = candyArray[i];
        if (intersect(monster, candy)) {
          img = happyMonster;
          candyArray.splice(i, 1);
          if (!candy.counted) {
            score = score + 1;
            candy.counted = true;
            yay.play(); // positiver Sound wird abgespielt wenn Monster candy bekommt
          }
        }
      }
      if (heartsArray.length >= 0 && score >= 50) {
        ctx.clearRect(0, 0, 600, 650);
        gameWon();
        return score;
      } else if (heartsArray.length <= 0) {
        ctx.clearRect(0, 0, 600, 650);
        gameOver();
        return score;
      }
    }
  }

  function crashSpecial() {
    if (heartsArray.length > 0) {
      for (var i = 0; i < specialArray.length; i++) {
        var special = specialArray[i];
        if (intersect(monster, special)) {
          img = happyMonster;
          specialArray.splice(i, 1);
          if (heartsArray.length < 6) {
            heartsArray.push(imgHeart);
          }
          if (!special.counted) {
            score = score + 3;
            special.counted = true;
            catchspecial.play(); // positiver Sound wird abgespielt wenn Monster candy bekommt
          }
        }
      }
      if (heartsArray.length > 0 && score >= 50) {
        ctx.clearRect(0, 0, 600, 650);
        gameWon();
        return score;
      } else if (heartsArray.length <= 0) {
        ctx.clearRect(0, 0, 600, 650);
        gameOver();
        return score;
      }
    }
  }

  function crashApple() {
    if (heartsArray.length > 0) {
      for (var i = 0; i < appleArray.length; i++) {
        var apple = appleArray[i];
        if (intersect(monster, apple)) {
          img = imgSad;
          appleArray.splice(i, 1);
          heartsArray.splice(0, 1);
          // ctx.strokeRect(monster.x, monster.y, monster.height, monster.width);
          if (!apple.counted) {
            score = score - 1;
            apple.counted = true;
          }
        }
      }
    }
    if (heartsArray.length > 0 && score >= 50) {
      ctx.clearRect(0, 0, 600, 650);
      gameWon();
      return score;
    } else if (heartsArray.length <= 0) {
      ctx.clearRect(0, 0, 600, 650);
      gameOver();
      return score;
    }
  }

  function crashCarrot() {
    if (heartsArray.length > 0) {
      for (var i = 0; i < carrotArray.length; i++) {
        var carrot = carrotArray[i];
        if (intersect(monster, carrot)) {
          img = imgSad;
          carrotArray.splice(i, 1);
          heartsArray.splice(0, 1);
          if (!carrot.counted) {
            score = score - 1;
            carrot.counted = true;
            huh.play();
          }
        }
      }
      if (heartsArray.length > 0 && score >= 50) {
        ctx.clearRect(0, 0, 600, 650);
        gameWon();
        return score;
      } else if (heartsArray.length <= 0) {
        ctx.clearRect(0, 0, 600, 650);
        gameOver();
        return score;
      }
    }
  }

  function intersect(monster, object) {
    var monsterleft = monster.x;
    var monstertop = monster.y;
    var monsterright = monster.x + monster.width;
    var monsterbottom = monster.y + monster.height;

    var objectleft = object.x + 30;
    var objecttop = object.y;
    var objectright = object.x + object.width - 20;
    var objectbottom = object.y + object.height;
    return !(
      monsterleft > objectright ||
      monsterright < objectleft ||
      monstertop > objectbottom ||
      monsterbottom < objecttop
    );
  }
};
