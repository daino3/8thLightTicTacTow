'use strict';

var aiGameCtrl = angular.module('controllers.aigame', ['services.game', 'services.ailogic'])

var EMPTY = ""

aiGameCtrl.controller('AIGame', ['$firebase', '$scope', 'gameService','ailogicService',
  function($firebase, $scope, gameService, ailogicService) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");

    $scope.playerName = EMPTY;
    $scope.playerRecord = {wins: 0, losses: 0, ties: 0}
    $scope.playerMarker = "X";
    $scope.computerMarker = "O";
    $scope.currentPlayer = EMPTY;
    $scope.board = gameService.gameBoard();

    $scope.startGame = function() {
      if ($scope.currentPlayer === EMPTY) {
        $scope.currentPlayer = gameService.flipCoin();
        alert("It's "+$scope.currentPlayer+"'s turn");
        if ($scope.currentPlayer === $scope.computerMarker){
          $scope.computerMove();
          $scope.switchPlayer();
        }
      }
      else {
        alert("The game has already begun! It's "+ $scope.currentPlayer + "'s turn");
      }
    }   

    $scope.takeSquare = function(box) {
      if ($scope.currentPlayer === EMPTY) {
        alert("You must flip the coin to determine who goes first");
      }
      else if (box.letter === $scope.playerMarker || box.letter === $scope.computerMarker) {
        alert("Select an open square!!!");
      }
      else {
        gameService.takeSquare(box, $scope.currentPlayer);
        $scope.winCheck();
        $scope.switchPlayer();
        setTimeout(console.log("Computer's Turn"), 1000);
        $scope.computerMove();
        setTimeout(console.log("Computer Went"), 5000);
        $scope.winCheck();
        $scope.switchPlayer();
      }
    }

    $scope.winCheck = function() {
      if (gameService.winner($scope.board)) {
        $scope.saveWin();
        alert($scope.currentPlayer + " has won!!");
        $scope.resetBoard();
      }
      else if (gameService.boardFull($scope.board)) {
        $scope.tieGame();
        alert("Game tied");
        $scope.resetBoard();
      }
    }

    $scope.tieGame = function() {
      $scope.playerRecord.ties += 1
    }

    $scope.switchPlayer = function() {
      $scope.currentPlayer === $scope.computerMarker ? $scope.currentPlayer = $scope.playerMarker : $scope.currentPlayer = $scope.computerMarker
    }

    $scope.computerMove = function() {
      // This logic must remain consistent
      if ($scope.someoneCanWin()) {
        console.log("Someone Could Win")
        $scope.blockOrWin();
      }
      else if ($scope.playerCanCreateFork()) {
        console.log("Player Can Create a Fork")
        $scope.blockFork();
      }
      else if ($scope.computerCanCreateFork()) {
        console.log("Computer Can Create a Fork")
        $scope.createFork();
      }
      else if ($scope.middleIsOpen()) {
        console.log("Took Middle")
        $scope.takeMiddle();
      }
      else if ($scope.cornersAreOpen()) {
        console.log("All Corners Are Open")
        ailogicService.takeCorner($scope.board, $scope.computerMarker);
      }
      else if ($scope.trapped($scope.board, $scope.playerMarker, $scope.computerMarker)) {
        console.log("trapped")
        $scope.takeMiddleSide($scope.board, $scope.computerMarker)
      }
      else if ($scope.openCorner() && $scope.playerTookCorner()){
        console.log("Player Took a Corner")
        $scope.playOppoCorner();
      }
      else {
        console.log("No Other Move")
        $scope.takeEmptySquare($scope.board, $scope.computerMarker)
      }
    }

    //----------- TRAPPED ------------//

    $scope.trapped = function(board, playerMarker, compMarker) {
      var middle   = board[1][1].letter
      var topleft  = board[0][0].letter
      var topright = board[0][2].letter
      var botleft  = board[2][0].letter
      var botright = board[2][2].letter

      if (topleft === playerMarker && botright === playerMarker && middle === compMarker) {
        return true
      }
      else if (botleft === playerMarker && topright === playerMarker && middle === compMarker) {
        return true
      }
      return false
    }

    $scope.takeMiddleSide = function(board, compMarker) {
      board[1][0].letter = compMarker
    }

    $scope.takeEmptySquare = function(board, compMarker) {
      for (var row = 0; row < board.length; row++) {
        for (var i = 0; i < board.length; i++) {
          if (board[row][i].letter === EMPTY) {
            board[row][i].letter = compMarker
          }
        }
      }
    }

    $scope.openCorner = function() {
      return ailogicService.openCorner($scope.board)      
    }

    //----------- TAKE MIDDLE IF OPEN ------------//

    $scope.middleIsOpen = function() {
      return ($scope.board[1][1].letter === EMPTY);
    }

    $scope.takeMiddle = function() {
      $scope.board[1][1].letter = $scope.computerMarker;
    }

    // ------------- BLOCK OR WIN ---------------//

    $scope.someoneCanWin = function() {
      return ailogicService.someoneCanWin($scope.board);
    }

    $scope.blockOrWin = function() {
      ailogicService.blockOrWin($scope.board, $scope.computerMarker);
    }

    //------------- FORK LOGIC -----------------//

    $scope.playerCanCreateFork = function() {
      return ailogicService.canCreateFork($scope.board, $scope.playerMarker);
    }

    $scope.blockFork = function() {
      ailogicService.blockFork($scope.board, $scope.playerMarker, $scope.computerMarker);
    }

    $scope.computerCanCreateFork = function() {
      return ailogicService.canCreateFork($scope.board, $scope.computerMarker);
    }

    $scope.createFork = function() {
      ailogicService.createFork($scope.board, $scope.computerMarker);
    }

    //-------------- ADJACENT CORNER LOGIC ---------------//

    // $scope.playAdjacentCorner = function() {
    //   ailogicService.playAdjacentCorner($scope.board, $scope.computerMarker);
    // }

    //------------ OTHER CPU MOVES ---------------//

    $scope.playerTookCorner = function() {
      return ailogicService.playerTookCorner($scope.board, $scope.playerMarker);
    }

    $scope.playOppoCorner = function() {
      ailogicService.playOppoCorner($scope.board, $scope.playerMarker, $scope.computerMarker);
    }

    $scope.cornersAreOpen = function() {
      return ailogicService.cornersAreOpen($scope.board);
    }

    //------------ OTHER GAME METHODS ---------------//

    $scope.resetBoard = function() {
      $scope.board = gameService.gameBoard();    
    }

    $scope.setName = function(e) {
      if (e.keyCode != 13) return;
        $scope.playerName = $scope.name
    }

    $scope.saveWin = function() {
      ($scope.playerMarker === $scope.currentPlayer) ? $scope.playerRecord.wins += 1 : $scope.playerRecord.losses += 1
    }

}])