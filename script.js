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
    winningBlocks: [],
    endGame: false,
    expectHumanMove: true,

    players: function (
      name,
      hits = [],
      winner = false,
      score = 0,
      endGame = false,
      active = false
    ) {
      this.active = active;

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

      return { score, name, addScore, hits, resetScore };
    },

    statistics: function () {
      this.Marios = this.players("Marios");
      this.Marios.turn = true;
      this.Enemy = this.players("Enemy");
      this.Computer = this.players("Computer");
      this.Computer.active = false;
    },

    init: function () {
      this.cacheDom();
      this.drawBoard();
      this.statistics();
      this.bindEvents();
    },
    cacheDom: function () {
      this.board = document.getElementById("gameboard");
      this.userOneButton = document.getElementById("buttonUserOne");
      this.userTwoButton = document.getElementById("buttonUserTwo");
      this.scoreUserOne = document.getElementById("scoreUserOne");
      this.scoreUserTwo = document.getElementById("scoreUserTwo");
      this.playerTurnSignal = document.getElementById("playerTurnSignal");
    },
    computerMoves: function () {
      gaming.Marios.turn = true;
      var computerNextMove = "4";

      console.log("marios", gaming.Marios.hits);
      var mariosLastMove = Number(
        gaming.Marios.hits[gaming.Marios.hits.length - 1]
      );

      console.log("marios last move", mariosLastMove);

      let mariosHitsNumbers = gaming.Computer.hits.map((x) => Number(x));
      let computerHitsNumbers = gaming.Marios.hits.map((y) => Number(y));

      let newArray = mariosHitsNumbers.concat(computerHitsNumbers);

      function acceptedMove(number) {
        if ((number < 0) | (number > 9)) {
          return false;
        }
        if (newArray.includes(number)) {
          return false;
        }
        return true;
      }

      function produceMoves(a) {
        if (a > 22) {
          return 0;
        }
        let randomBlockNumber = Math.floor(Math.random() * 9);
        console.log(`try: ${randomBlockNumber}`);
        let testMove = acceptedMove(randomBlockNumber);
        if (testMove) {
          return randomBlockNumber;
        }

        console.log("failed");

        return produceMoves(a + 1);
      }

      this.playerTurnSignal.innerText = "Make a move!";
      console.log("Com:");
      console.log(`New Array: ${newArray}, Marios hits: ${gaming.Marios.hits}`);
      if (!newArray.includes(4)) {
        gaming.Computer.hits.push("4");

        let getBlock = gaming.board.querySelector(`div[data-id-Of-Block='4']`);
        getBlock.innerText = "O";
        getBlock.dataset.clicked = "true";
        gaming.bindEventsBlocks(getBlock);
      } else if (newArray.length < 9) {
        let nextMove = produceMoves(1);

        let getBlock = gaming.board.querySelector(
          `div[data-id-Of-Block='${nextMove}']`
        );

        getBlock.dataset.clicked = "true";
        gaming.bindEventsBlocks(getBlock);

        let pushMove = nextMove.toString();
        gaming.Computer.hits.push(pushMove);

        getBlock.innerText = "O";
      }
      console.log(gaming.Computer.hits);
      if (
        gaming.isArrayIncluded(gaming.winningCombinations, gaming.Computer.hits)
      ) {
        console.log("Enemy won");
        gaming.scoreUserTwo.innerText = gaming.Computer.addScore();

        this.winner = true;
      }
    },

    clickBoardHandler: function () {
      console.log(gaming.Marios.hits, "marios hits");
      if (gaming.Computer.hits !== []) {
        gaming.Enemy.hits = gaming.Computer.hits;
      }
      let totalHits = gaming.Marios.hits.length + gaming.Enemy.hits.length;
      console.log("total hist", totalHits);
      if (
        (gaming.winner && gaming.endGame) ||
        (totalHits === 9 && gaming.endGame)
      ) {
        gaming.clearBoard();
        gaming.winner = false;
        gaming.Marios.resetScore();
        gaming.Enemy.resetScore();
        gaming.Computer.resetScore();
        gaming.endGame = false;
        gaming.Marios.turn = true;
      } else if (gaming.winner || totalHits === 9) {
        gaming.endGame = true;
      }
    },
    // Used for clearing the board
    bindEvents: function () {
      this.board.addEventListener("click", this.clickBoardHandler);
    },
    // Used only for human moves
    bindEventsBlocks: function (singleBlock) {
      if (singleBlock.dataset.clicked === "true") {
        singleBlock.removeEventListener("click", this.movesHandler);
        console.log("remove Event");
      } else {
        singleBlock.addEventListener("click", this.movesHandler);
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
        //console.log(`First: ${blockBoard.dataset.idOfBlock}`);
        this.bindEventsBlocks(blockBoard);
      }
    },
    isArrayIncluded: function (nestedArray, targetArray) {
      return nestedArray.some((subArray) => {
        return subArray.every((element) => {
          return targetArray.includes(element);
          // if (targetArray.includes(element)) {
          //   this.winningBlocks.push(element);
          //   return true;
          // }
        });
      });
    },
    movesHandler: function (takeBlock) {
      if (gaming.expectHumanMove) {
        var myBlock = takeBlock.target;
        if (gaming.Marios.turn) {
          gaming.drawOnBlock("X", myBlock);
          gaming.Marios.hits.push(myBlock.dataset.idOfBlock);
          gaming.checkForWins(gaming.Marios, gaming.scoreUserOne);
          gaming.Marios.turn = false;
        } else {
          gaming.drawOnBlock("O", myBlock);
          gaming.Enemy.hits.push(myBlock.dataset.idOfBlock);
          gaming.checkForWins(gaming.Enemy, gaming.scoreUserTwo);
          gaming.Marios.turn = true;
        }
      }
    },
    checkForWins: function (player, domElement) {
      console.log("player", player);
      if (gaming.isArrayIncluded(this.winningCombinations, player.hits)) {
        domElement.innerText = player.addScore();
        this.winner = true;
      }
    },

    drawOnBlock: function (markMove, singleBlock) {
      console.log("endgame", gaming.endGame);
      if (gaming.winner) {
        return;
      }
      console.log("new", singleBlock);
      singleBlock.dataset.clicked = "true";
      this.bindEventsBlocks(singleBlock);

      if (this.Marios.turn) {
        this.playerTurnSignal.innerText = "Think before playing!";

        this.Marios.turn = false;
        singleBlock.innerText = markMove;

        //this.Marios.hits.push(singleBlock.dataset.idOfBlock);
        console.log(`marios hits: ${this.Marios.hits}`);

        if (this.isArrayIncluded(this.winningCombinations, this.Marios.hits)) {
          console.log("Marios won");
          //this.scoreUserOne.innerText = this.Marios.addScore();
          //this.winner = true;
          this.Computer.active = false;
        }
      } else if (!this.Computer.active) {
        console.log("computer active");
        this.playerTurnSignal.innerText = "Make a move!";
        singleBlock.innerText = markMove;

        //this.Marios.turn = true;
        //this.Enemy.hits.push(idBlock);

        if (this.isArrayIncluded(this.winningCombinations, this.Enemy.hits)) {
          console.log("Enemy won");
          //this.scoreUserTwo.innerText = this.Enemy.addScore();

          //this.winner = true;
        }
      }

      if (this.Computer.active && !this.winner) {
        setTimeout(this.computerMoves, 1100);
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
