function rectCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

//Win display/timer stop
function showWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#textDisplay").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#textDisplay").innerHTML = "It's a draw!";
  } else if (player.health > enemy.health) {
    document.querySelector("#textDisplay").innerHTML =
      "Player 1 is the mighty one!";
  } else if (enemy.health > player.health) {
    document.querySelector("#textDisplay").innerHTML =
      "Player 2 is the mighty one!";
  }
}

//Timer
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  //Show text if health is equal at end of timer
  if (timer === 0) {
    showWinner({ player, enemy, timerId });
  }
}
