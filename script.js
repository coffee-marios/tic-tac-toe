(function () {
  var gaming = {
    Gameboard: [2, 2],
    playerA: [],
    playerB: [],

    init: function () {
      this.cacheDom();
      this.drawBoard();
    },
    cacheDom: function () {
      this.board = document.getElementById("gameboard");
    },

    drawBoard: function () {
      console.log(this.board, 3);

      for (let i = 0; i < 9; i++) {
        this.blockBoard = document.createElement("div");
        this.blockBoard.classList.add("block-board");
        this.blockBoard.dataset.idOfBlock = i;

        this.board.appendChild(this.blockBoard);
        this.blockBoard.onclick = this.drawBlock.bind(
          this,
          this.blockBoard.dataset.idOfBlock
        );
      }
    },
    drawBlock: function (i) {
      var getBlock = this.board.querySelector(`div[data-id-Of-Block='${i}']`);
      getBlock.innerText = "X";
      console.log(getBlock);
    },
  };
  gaming.init();
})();
