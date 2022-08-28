
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
  imageSrc: "./images/mountainsDetail.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 225,
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
    }
  },
  attackBox: {
    offset: {
      x: 0,
      y: 0,
    },
  }
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
  imageSrc: "./images/Hero2/Sprites/Idle.png",
  frameMax: 4,
  scale: 2.5,
  offset: {
    x: 150,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "./images/Hero2/Sprites/Idle.png",
      frameMax: 4,
    },
    run: {
      imageSrc: "./images/Hero2/Sprites/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./images/Hero2/Sprites/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./images/Hero2/Sprites/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./images/Hero2/Sprites/Attack1.png",
      frameMax: 4,
    }
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

  //collisions
  if (
    rectCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //end game - kill win
  if (enemy.health <= 0 || player.health <= 0) {
    showWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (e) => {
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

    //Enemy keys
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
