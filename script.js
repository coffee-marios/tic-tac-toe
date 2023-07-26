(function () {
  console.log("OK");

  var gaming = {
    Gameboard: [2, 2],
    players: function (name, turn = true, score = 3) {
      this.turn = turn;
      this.score = score;
      this.name = name;
      function addScore() {
        this.score += 3;
        return this.score;
      }
      function giveBack() {
        this.turn = !this.turn;
        return () => this.turn;
      }
      return { turn, score, name, giveBack, addScore };
    },

    statistics: function () {
      this.Marios = this.players("Marios");
      this.Enemy = this.players("Enemy");
    },

    init: function () {
      this.cacheDom();
      this.drawBoard();
      this.statistics();
    },
    cacheDom: function () {
      this.board = document.getElementById("gameboard");
    },
    bindEvents: function (i) {
      const once = {
        once: true,
      };
      const clickBlock = () => {
        this.drawBlock(i);
      };
      this.blockBoard.addEventListener("click", clickBlock, once);
      // this.blockBoard.removeEventListener("click", clickBlock);
    },

    drawBoard: function () {
      for (let i = 0; i < 9; i++) {
        this.blockBoard = document.createElement("div");
        this.blockBoard.classList.add("block-board");
        this.blockBoard.dataset.idOfBlock = i;
        this.board.appendChild(this.blockBoard);
        this.bindEvents(this.blockBoard.dataset.idOfBlock);
      }
    },
    drawBlock: function (i) {
      var getBlock = this.board.querySelector(`div[data-id-Of-Block='${i}']`);

      console.log(`drawBlock: ${this.Marios.giveBack}`);

      this.Marios.giveBack()()
        ? (getBlock.innerText = "X")
        : (getBlock.innerText = "O");

      console.log(this.Marios.addScore());

      console.log(getBlock);
    },
  };
  gaming.init();
})();
