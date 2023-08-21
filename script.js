(function () {
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
    state: 0,
    totalGames: 0,
    endMatch: false,

    setGame: function (event) {
      event.preventDefault();

      gaming.personalDataForm.style.display = "none";
      gaming.mainElement.style.display = "block";
      console.log("number of games", gaming.setOfGames.value);
      if (gaming.typeAIhumanGame.value === "computer") {
        gaming.Computer.active = true;
      }

      if (gaming.formNameUser.value !== "") {
        gaming.displayedNameUser.innerText = `${gaming.formNameUser.value}:  `;
      }
      if (gaming.formNameEnemy.value !== "") {
        gaming.displayedNameEnemy.innerText = `${gaming.formNameEnemy.value}:  `;
      }
    },
    restartGame: function () {
      console.clear();
      console.log("restart");
      gaming.totalGames = 0;
      gaming.expectHumanMove = true;
      gaming.endGame = false;
      gaming.endMatch = false;
      gaming.Marios.score = 0;
      gaming.Enemy.score = 0;
      gaming.scoreUserOne.innerText = "0";
      gaming.scoreUserTwo.innerText = "0";
    },

    players: function (
      name,
      hits = [],
      winner = false,
      score = 0,

      active = true
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
      function resetHitsArray() {
        this.hits = [];
      }

      return { score, name, addScore, hits, resetHitsArray };
    },

    statistics: function () {
      this.Marios = this.players("Marios");
      this.Marios.turn = true;
      this.Enemy = this.players("Enemy");
      this.Computer = this.players("Computer");
    },

    init: function () {
      this.cacheDom();
      this.drawBoard();
      this.statistics();
      this.bindEvents();
    },
    cacheDom: function () {
      this.mainElement = document.getElementById("main");

      this.personalDataForm = document.getElementById("personal-data");
      this.formNameUser = document.getElementById("fname1");
      this.displayedNameUser = document.getElementById("namePlayerOne");
      this.formNameEnemy = document.getElementById("fname2");
      this.displayedNameEnemy = document.getElementById("namePlayerTwo");
      this.setOfGames = document.getElementById("numberGames");
      this.typeAIhumanGame = document.getElementById("typeGame");

      this.restart = document.getElementById("buttonRestart");

      this.board = document.getElementById("gameboard");
      this.userOneButton = document.getElementById("buttonUserOne");
      this.userTwoButton = document.getElementById("buttonUserTwo");
      this.scoreUserOne = document.getElementById("scoreUserOne");
      this.scoreUserTwo = document.getElementById("scoreUserTwo");
      this.playerTurnSignal = document.getElementById("playerTurnSignal");
      this.buttonData = document.getElementById("buttonData");
    },

    /* if (this.Computer.active && !this.winner) {
      setTimeout(this.computerMoves, 1100);
    } */

    // Test number produced by the computer for potential move
    acceptedMove: function (number, allHits) {
      if ((number < 0) | (number > 9)) {
        return false;
      }
      if (allHits.includes(number)) {
        return false;
      }
      console.log("all hits", allHits);
      return true;
    },
    findNumber(a, allNumbersArray) {
      if (a > 22) {
        console.log("a", a);
        return 0;
      }
      let randomBlockNumber = Math.floor(Math.random() * 9);
      let testMove = this.acceptedMove(randomBlockNumber, allNumbersArray);
      if (testMove) {
        return randomBlockNumber;
      } else {
        console.log("failed");
        return this.findNumber(a + 1, allNumbersArray);
      }
    },
    produceMoves: function (a, allNumbers) {
      // Best possible move
      if (!allNumbers.includes(4)) {
        let getBlock = gaming.board.querySelector(`div[data-id-Of-Block='4']`);

        return getBlock;
      }
      if (allNumbers.length < 9) {
        let nextMove = this.findNumber(1, allNumbers);
        console.log("next move: ", nextMove);
        let getBlock = gaming.board.querySelector(
          `div[data-id-Of-Block='${nextMove}']`
        );
        return getBlock;
      }
    },

    regulateMoves: function (blockUsed) {
      console.log("reg: total games", this.totalGames);
      console.log("reg: End of set: ", this.endMatch);
      // if (this.endMatch) {
      //   console.log("End OF Match");
      //   return;
      // }

      if (this.expectHumanMove && !this.endGame) {
        if (this.Marios.turn) {
          this.drawOnBlock("X", blockUsed);
          this.Marios.hits.push(blockUsed.dataset.idOfBlock);

          this.Marios.turn = false;
          var checkContinue = this.checkForWins(this.Marios, this.scoreUserOne);

          // We want to check if the user won before we ask the computer to move
          if (!checkContinue && this.Computer.active && !this.endGame) {
            var totalHits =
              gaming.Marios.hits.length + gaming.Enemy.hits.length;

            console.debug("debug");
            if (totalHits == 9) {
              return;
            }
            this.expectHumanMove = true;
            this.Marios.turn = true;

            var enemyHitsNumbers = this.Enemy.hits.map((x) => Number(x));
            var mariosHitsNumbers = this.Marios.hits.map((y) => Number(y));
            var newArray = mariosHitsNumbers.concat(enemyHitsNumbers);
            console.log("computermoves send this array: ", newArray);
            console.log("computermoves sends Enemy hits: ", gaming.Enemy.hits);

            var playedMoves = this.Enemy.hits.concat(this.Marios.hits);

            var goodAttackingMove = this.isDangerousArray(
              this.winningCombinations,
              playedMoves,
              this.Enemy.hits
            );

            var computerBlock;

            if (goodAttackingMove === 99) {
              console.warn("Not good attack");
              var goodDefensiveMove = this.isDangerousArray(
                this.winningCombinations,
                playedMoves,
                this.Marios.hits
              );
              if (goodDefensiveMove === 99) {
                computerBlock = this.produceMoves(1, newArray);
              } else {
                computerBlock = gaming.board.querySelector(
                  `div[data-id-Of-Block='${goodDefensiveMove}']`
                );
                console.log("marios hits", this.Marios.hits);
              }
            } else {
              console.warn("WTF?");
              computerBlock = gaming.board.querySelector(
                `div[data-id-Of-Block='${goodAttackingMove}']`
              );
            }

            this.drawOnBlock("O", computerBlock);
            this.Enemy.hits.push(computerBlock.dataset.idOfBlock);
            this.checkForWins(this.Enemy, this.scoreUserTwo);
            this.Marios.turn = true;
          }
        } else if (!gaming.Computer.active) {
          this.drawOnBlock("O", blockUsed);
          this.Enemy.hits.push(blockUsed.dataset.idOfBlock);
          this.checkForWins(gaming.Enemy, gaming.scoreUserTwo);
          this.Marios.turn = true;
        }
      }
    },

    clickBoardHandler: function () {
      var totalHits = gaming.Marios.hits.length + gaming.Enemy.hits.length;

      console.log("board: End OF Match", gaming.endMatch);

      console.log("set games number: ", gaming.setOfGames.value);
      console.log("board: total games", gaming.totalGames);
      console.log("board: End of set: ", gaming.endMatch);

      if (!gaming.winner && totalHits < 9) {
        console.log("I stop at the board");
        return;
      }

      if (
        (gaming.winner && gaming.endGame) ||
        (totalHits == 9 && gaming.endGame)
      ) {
        // console.log("total hits that clear: ", totalHits);
        // console.log("marios hits: ", gaming.Marios.hits);
        // console.log("enemy hits: ", gaming.Enemy.hits);
        // console.warn("gaming winner: ", gaming.winner);
        gaming.totalGames += 1;
        console.log("I expect +=1");
        gaming.clearBoard();
        gaming.winner = false;
        gaming.Marios.resetHitsArray();
        gaming.Enemy.resetHitsArray();
        gaming.Computer.resetHitsArray();
        gaming.endGame = false;
        gaming.Marios.turn = true;
        if (gaming.totalGames >= gaming.setOfGames.value) {
          gaming.endGame = true;
          gaming.endMatch = true;
          console.log("End OF Match condition", gaming.endMatch);
        }
      } else if (gaming.winner || totalHits == 9) {
        gaming.endGame = true;

        console.debug("total hit at the board: ", totalHits);
      }
    },
    // Used for clearing the board
    bindEvents: function () {
      this.board.addEventListener("click", this.clickBoardHandler);
      this.buttonData.addEventListener("click", this.setGame);
      this.restart.addEventListener("click", this.restartGame);
    },
    // Used only for human moves
    bindEventsBlocks: function (singleBlock) {
      if (singleBlock.dataset.clicked === "true") {
        singleBlock.removeEventListener("click", this.movesHandler);
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
        this.bindEventsBlocks(blockBoard);
      }
    },

    drawOnBlock: function (markMove, singleBlock) {
      if (gaming.winner) {
        return;
      }

      if (markMove === "X") {
        singleBlock.style.color = "blue";
      } else {
        singleBlock.style.color = "red";
      }

      singleBlock.innerText = markMove;

      singleBlock.dataset.clicked = "true";
      this.bindEventsBlocks(singleBlock);
    },

    clearBoard: function () {
      for (let i = 0; i < 9; i++) {
        let getBlock = this.board.querySelector(`div[data-id-Of-Block='${i}']`);
        getBlock.innerText = "";
        this.playerTurnSignal.innerText = `Game goes on!`;

        getBlock.dataset.clicked = "false";
        this.bindEventsBlocks(getBlock);
      }
    },
    isDangerousArray: function (nestArray, playedMoves, playersMoves) {
      var mappedArray = nestArray.map((array) => {
        console.log(array[0], playedMoves);
        if (
          playersMoves.includes(array[0]) &&
          playersMoves.includes(array[1]) &&
          !playedMoves.includes(array[2])
        ) {
          console.warn("dangerous", array[2], true);
          return array[2];
        }
        if (
          playersMoves.includes(array[0]) &&
          playersMoves.includes(array[2]) &&
          !playedMoves.includes(array[1])
        ) {
          console.warn("dangerous", array[1], true);
          return array[1];
        }
        if (
          playersMoves.includes(array[1]) &&
          playersMoves.includes(array[2]) &&
          !playedMoves.includes(array[0])
        ) {
          console.warn("dangerous", array[0], true);
          return array[0];
        }
        return false;
      });

      for (let i = 0; i < mappedArray.length; i++) {
        if (mappedArray[i] !== false) {
          return mappedArray[i];
        }
      }
      return 99;
    },

    isArrayIncluded: function (nestedArray, targetArray) {
      return nestedArray.some((subArray) => {
        return subArray.every((element) => {
          return targetArray.includes(element);
        });
      });
    },
    movesHandler: function (takeBlock) {
      console.log(gaming.Marios.turn, "marios");
      gaming.regulateMoves(takeBlock.target);
    },
    checkForWins: function (player, domElement) {
      if (gaming.isArrayIncluded(this.winningCombinations, player.hits)) {
        domElement.innerText = player.addScore();
        this.playerTurnSignal.innerText = `${player.name} WON`;
        this.winner = true;
      }
      return this.winner;
    },
  };
  gaming.init();
})();
