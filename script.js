(function () {
  console.log("OK");

  var gaming = {
    Gameboard: [2, 2],
    players: function (name, hits = [], score = 3) {
      this.score = score;
      this.name = name;
      this.hits = hits;
      function addScore() {
        this.score += 3;
        return this.score;
      }

      return { score, name, addScore, hits };
    },

    statistics: function () {
      this.Marios = this.players("Marios");
      this.Marios.turn = true;
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
        this.drawOnBlock(i); // the 'i' comes from the loop in drawBoard
      };
      this.blockBoard.addEventListener("click", clickBlock, once);
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
    drawOnBlock: function (i) {
      var getBlock = this.board.querySelector(`div[data-id-Of-Block='${i}']`);

      console.log(`drawOnBlock: ${getBlock.dataset.idOfBlock}`);

      if (this.Marios.turn) {
        getBlock.innerText = "X";
        this.Marios.turn = false;
        this.Marios.hits.push(getBlock.dataset.idOfBlock);
        console.log("Marios made this move. Score:");
        console.log(this.Marios.hits);
      } else {
        getBlock.innerText = "O";
        this.Marios.turn = true;
        this.Enemy.hits.push(getBlock.dataset.idOfBlock);

        console.log("The enemy made this move. Score:");
        console.log(this.Enemy.hits);
      }

      //console.log(this.Marios.addScore());

      //console.log(getBlock);
    },
  };
  gaming.init();
})();
