(function () {
  console.log("OK");

  var gaming = {
    winningCombinations: [
      ["0", "1", "2"],
      ["3", "4", "5"],
      ["6", "7", "8"],
      ["0", "3", "6"],
      ["1", "4", "7"],
      ["2", "5", "8"],
      ["0", "4", "8"],
      ["2", "4", "6"],
    ],

    players: function (name, hits = [], winner = false, score = 3) {
      this.score = score;
      this.name = name;
      this.hits = hits;
      this.winner = winner;
      function addScore() {
        this.score += 3;
        return this.score;
      }
      function resetScore() {
        this.hits = [];
      }

      return { score, name, addScore, hits, resetScore };
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
    clickBlockHandler: function (e) {
      gaming.drawOnBlock(e.target);
      console.log(e.target.dataset.idOfBlock);
    },

    // This doesn't seem to remove the event listener:
    bindEvents: function (singleBlock) {
      if (singleBlock.dataset.clicked === "true") {
        singleBlock.removeEventListener("click", this.clickBlockHandler);
        console.log(3);
      } else {
        singleBlock.addEventListener("click", this.clickBlockHandler);
        singleBlock.dataset.clicked = "true";
      }
    },

    drawBoard: function () {
      for (let i = 0; i < 9; i++) {
        this.blockBoard = document.createElement("div");
        this.blockBoard.classList.add("block-board");
        this.blockBoard.dataset.idOfBlock = i;
        this.blockBoard.dataset.clicked = "false";

        this.board.appendChild(this.blockBoard);
        console.log(`First: ${this.blockBoard.dataset.idOfBlock}`);
        this.bindEvents(this.blockBoard);
      }
    },
    drawOnBlock: function (singleBlock) {
      // singleBlock.dataset.clicked = "true";

      console.log(singleBlock.dataset);
      this.bindEvents(singleBlock);

      if (this.winner) {
        // this.clearBoard();
        this.winner = false;
        this.Marios.resetScore();
        this.Enemy.resetScore();
        console.log(this.winner);
        return;
      }

      console.log(`drawOnBlock: ${singleBlock.dataset.idOfBlock}`);

      function isArrayIncluded(nestedArray, targetArray) {
        return nestedArray.some((subArray) => {
          return subArray.every((element) => {
            return targetArray.includes(element);
          });
        });
      }

      if (this.Marios.turn) {
        singleBlock.innerText = "X";

        this.Marios.turn = false;
        this.Marios.hits.push(singleBlock.dataset.idOfBlock);
        console.log("Marios made this move. Score:");
        //        console.log(this.Marios.hits);

        if (isArrayIncluded(this.winningCombinations, this.Marios.hits)) {
          console.log("Marios won");
          this.winner = true;
        }
      } else {
        singleBlock.innerText = "O";
        this.Marios.turn = true;
        this.Enemy.hits.push(singleBlock.dataset.idOfBlock);
        if (isArrayIncluded(this.winningCombinations, this.Enemy.hits)) {
          console.log("Enemy won");
          this.winner = true;
        }
      }
    },
    clearBoard: function () {
      for (let i = 0; i < 9; i++) {
        let getBlock = this.board.querySelector(`div[data-id-Of-Block='${i}']`);
        getBlock.innerText = "";
      }
    },
  };
  gaming.init();
})();
