'use strict';

var aiGameCtrl = angular.module('controllers.aigame', ['services.game', 'services.ailogic'])

var EMPTY = ""
var PLAYER = "X"
var COMPUTER = "O"

aiGameCtrl.controller('AIGame', ['$firebase', '$scope', 'gameService','ailogicService',
  function($firebase, $scope, gameService, ailogicService) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");

    $scope.playerName = EMPTY;
    $scope.playerRecord = {wins: 0, losses: 0, ties: 0}
    $scope.playerMarker = PLAYER;
    $scope.computerMarker = COMPUTER;
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
      else if (box.letter !== EMPTY) {
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
        $scope.takeCorner();
      }
      else if ($scope.trapped()) {
        console.log("trapped")
        $scope.takeMiddleSide()
      }
      else if ($scope.playerTookCornerandOppoCornerFree()){
        console.log("Player Took a Corner")
        $scope.playOppoCorner();
      }
      else if ($scope.canGetTwoInaRow($scope.board, $scope.computerMarker)) {
        console.log("Getting two in a row")
        $scope.getTwoinaRow();
      }
      else {
        console.log("No Other Move")
        $scope.takeEmptySquare($scope.board, $scope.computerMarker)
      }
    }

    //-------------- TRAPPED ---------------//

    $scope.trapped = function() {
      return ailogicService.trapped($scope.board, $scope.playerMarker, $scope.compMarker);
    }

    $scope.takeMiddleSide = function() {
      $scope.board[1][0].letter = $scope.compMarker
    }

    //----------- CAN GET TWO IN A ROW ------------//

    $scope.canGetTwoInaRow = function(board, marker) {
      var rows = gameService.groupRows(board);
      var cols = gameService.groupRows(board);
      var diag = gameService.groupDiagonals(board);
      
      if ($scope.oneboxtaken(rows, marker)) {return true};
      if ($scope.oneboxtaken(cols, marker)) {return true};
      if ($scope.oneboxtaken(diag, marker)) {return true};
    }

    $scope.oneboxtaken = function(array, marker) {
      for (var i = 0; i < array.length; i++) {
        var empties = array[i].filter(function(e) {return e === EMPTY}).length
        var markers = array[i].filter(function(e) {return e === marker}).length
        if (empties === 2 && markers === 1) {
          return true;
        }
      }
      return false;
    }

    $scope.getTwo = function(board, marker) {
      var rows = gameService.groupRows(board);
      var cols = gameService.groupRows(board);
      var diag = gameService.groupDiagonals(board);

      if ($scope.oneboxtaken(rows, marker)) {

      }
      else if ($scope.oneboxtaken(cols, marker)) {

      }
      else if ($scope.oneboxtaken(diag, marker)) {

      }

    }

    $scope.getTwo_Rows = function(board, compMarker) {
      var rows = gameService.groupRows(board);
      for (var index = 0; index < board.length; index++) {
        if (rows[index].hasTwoSameValues(PLAYER, COMPUTER) && rows[index].hasEmptyBox(2)) {
          var boxNum = rows[index].indexOf(EMPTY);
          board[index][boxNum].letter = compMarker;
        }
      }
    },

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

    //------------ PLAY OPPO CORNERS ---------------//

    $scope.playerTookCornerandOppoCornerFree = function() {
      return ailogicService.playerTookCornerandOppoCornerFree($scope.board, $scope.playerMarker);
    }

    $scope.playOppoCorner = function() {
      ailogicService.playOppoCorner($scope.board, $scope.playerMarker, $scope.computerMarker);
    }


    //------------ OTHER CPU MOVES ---------------//

    $scope.cornersAreOpen = function() {
      return ailogicService.cornersAreOpen($scope.board);
    }

    $scope.takeCorner = function() {
      ailogicService.takeCorner($scope.board, $scope.computerMarker);
    }

    $scope.takeEmptySquare = function() {
      ailogic.takeEmptySquare($scope.board, $scope.compMarker)
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