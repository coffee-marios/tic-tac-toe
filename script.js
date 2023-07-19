// Create a board
(function () {
  var board = document.getElementById("gameboard");

  for (let i = 0; i < 3; i++) {
    const blockBoard = document.createElement("div");
    blockBoard.classList.add("block-board");
    board.appendChild(blockBoard);

    for (let j = 0; j < 3; j++) {
      const blockBoard = document.createElement("div");
      blockBoard.classList.add("block-board");
      board.appendChild(blockBoard);
    }
  }
})();
