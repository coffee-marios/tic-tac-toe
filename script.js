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

    players: function (
      name,
      hits = [],
      winner = false,
      score = 0,
      endGame = false
    ) {
      this.endGame = endGame;

      this.score = score;
      this.name = name;
      this.hits = hits;
      this.winner = winner;
      function addScore() {
        this.score += 1;
        return this.score;
      }
      function resetScore() {
        this.hits = [];
      }

      return { score, name, addScore, hits, resetScore, endGame };
    },
    logic: function () {
      // this.endGame = endGame;
      // return { endGame };
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
      this.bindEvents();
      this.logic();
    },
    cacheDom: function () {
      this.board = document.getElementById("gameboard");
      this.userOneButton = document.getElementById("buttonUserOne");
      this.userTwoButton = document.getElementById("buttonUserTwo");
      this.scoreUserOne = document.getElementById("scoreUserOne");
      this.scoreUserTwo = document.getElementById("scoreUserTwo");
      this.playerTurnSignal = document.getElementById("playerTurnSignal");
    },
    clickBlockHandler: function (e) {
      gaming.drawOnBlock(e.target);
    },
    clickBoardHandler: function () {
      let totalHits = gaming.Marios.hits.length + gaming.Enemy.hits.length;
      console.log(1, gaming.endGame, totalHits);
      if ((gaming.winner && gaming.endGame) || totalHits === 10) {
        gaming.clearBoard();
        gaming.winner = false;
        gaming.Marios.resetScore();
        gaming.Enemy.resetScore();
        gaming.endGame = false;
      } else if (gaming.winner) {
        gaming.endGame = true;
      }
    },
    bindEvents: function () {
      this.board.addEventListener("click", this.clickBoardHandler);
    },

    bindEventsBlocks: function (singleBlock) {
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
        let blockBoard = document.createElement("div");
        blockBoard.classList.add("block-board");
        blockBoard.dataset.idOfBlock = i;
        blockBoard.dataset.clicked = "false";

        this.board.appendChild(blockBoard);
        console.log(`First: ${blockBoard.dataset.idOfBlock}`);
        this.bindEventsBlocks(blockBoard);
      }
    },
    drawOnBlock: function (singleBlock) {
      this.bindEventsBlocks(singleBlock);

      function isArrayIncluded(nestedArray, targetArray) {
        return nestedArray.some((subArray) => {
          return subArray.every((element) => {
            return targetArray.includes(element);
          });
        });
      }

      if (this.Marios.turn) {
        this.playerTurnSignal.innerText = "Think before playing!";

        this.Marios.turn = false;
        singleBlock.innerText = "X";
        this.Marios.turn = false;
        this.Marios.hits.push(singleBlock.dataset.idOfBlock);
        console.log("Marios made this move. Score:");

        if (isArrayIncluded(this.winningCombinations, this.Marios.hits)) {
          console.log("Marios won");
          this.scoreUserOne.innerText = this.Marios.addScore();
          this.winner = true;
        }
      } else {
        this.playerTurnSignal.innerText = "Make a move!";
        singleBlock.innerText = "O";
        this.Marios.turn = true;
        this.Enemy.hits.push(singleBlock.dataset.idOfBlock);
        if (isArrayIncluded(this.winningCombinations, this.Enemy.hits)) {
          console.log("Enemy won");
          this.scoreUserTwo.innerText = this.Enemy.addScore();

          this.winner = true;
        }
      }
    },
    clearBoard: function () {
      for (let i = 0; i < 9; i++) {
        let getBlock = this.board.querySelector(`div[data-id-Of-Block='${i}']`);
        getBlock.innerText = "";
        getBlock.dataset.clicked = "false";
        this.bindEventsBlocks(getBlock);
      }
    },
  };
  gaming.init();
})();
