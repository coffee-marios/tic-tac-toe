(function () {
  console.log("OK");
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
    bindEvents: function (i) {
      this.blockBoard.addEventListener("click", () => {
        this.drawBlock(i);
      });
    },

    drawBoard: function () {
      for (let i = 0; i < 9; i++) {
        this.blockBoard = document.createElement("div");
        this.blockBoard.classList.add("block-board");
        this.blockBoard.dataset.idOfBlock = i;
        this.board.appendChild(this.blockBoard);
        this.bindEvents(this.blockBoard.dataset.idOfBlock);

        // Also works, without bindEvents
        // this.blockBoard.onclick = this.drawBlock.bind(
        //   this,
        //   this.blockBoard.dataset.idOfBlock
        // );
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
