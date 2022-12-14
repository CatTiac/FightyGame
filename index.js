const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/TallFloorForest.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 194,
  },
  imageSrc: "./images/shop_anim.png",
  scale: 2.5,
  frameMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/Hero/Sprites/Idle.png",
  frameMax: 8,
  scale: 2.5,
  offset: {
    x: 150,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: "./images/Hero/Sprites/Idle.png",
      frameMax: 8,
    },
    run: {
      imageSrc: "./images/Hero/Sprites/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./images/Hero/Sprites/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./images/Hero/Sprites/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./images/Hero/Sprites/Attack1.png",
      frameMax: 6,
    },
    takeHit: {
      imageSrc: "./images/Hero/Sprites/Take hit - white silhouette.png",
      frameMax: 4,
    },
    death: {
      imageSrc: "./images/Hero/Sprites/Death.png",
      frameMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 120,
      y: 50,
    },
    width: 180,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 120,
    y: 170,
  },
  color: "blue",
  imageSrc: "./images/Hero2/Sprites/H2NewIdle.png",
  frameMax: 4,
  scale: 2.5,
  offset: {
    x: 150,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "./images/Hero2/Sprites/H2NewIdle.png",
      frameMax: 4,
    },
    run: {
      imageSrc: "./images/Hero2/Sprites/H2NewRun.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./images/Hero2/Sprites/H2NewJump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./images/Hero2/Sprites/H2NewFall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./images/Hero2/Sprites/H2NewAttack1.png",
      frameMax: 4,
    },
    takeHit: {
      imageSrc: "./images/Hero2/Sprites/H2NewTake hit.png",
      frameMax: 3,
    },
    death: {
      imageSrc: "./images/Hero2/Sprites/H2NewDeath.png",
      frameMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -120,
      y: 50,
    },
    width: 180,
    height: 50,
  },
});

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //Moves - player
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //Moves - Enemy
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //collisions & enemy hit
  if (
    rectCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  //player miss
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  //player hit
  if (
    rectCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //enemy miss
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  //end game - kill win
  if (enemy.health <= 0 || player.health <= 0) {
    showWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    switch (e.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }

    //Enemy keys
    if (!enemy.dead) {
      switch (e.key) {
        case "ArrowRight":
          keys.ArrowRight.pressed = true;
          enemy.lastKey = "ArrowRight";
          break;
        case "ArrowLeft":
          keys.ArrowLeft.pressed = true;
          enemy.lastKey = "ArrowLeft";
          break;
        case "ArrowUp":
          enemy.velocity.y = -20;
          break;
        case "ArrowDown":
          enemy.attack();
          break;
      }
    }
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
  //Enemy keys
  switch (e.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
