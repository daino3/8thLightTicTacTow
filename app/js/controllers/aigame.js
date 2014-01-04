'use strict';

var aiGameCtrl = angular.module('controllers.aigame', ['services.game', 'services.ailogic'])

aiGameCtrl.controller('AIGame', ['$firebase', '$scope', 'gameService','ailogicService',
  function($firebase, $scope, gameService) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");

    $scope.playerName = ""
    $scope.playerRecord = {wins: 0, losses: 0, ties: 0}
    $scope.playerMarker = "X"
    $scope.computerMarker = "O"
    $scope.currentPlayer = ""
    $scope.board = gameService.gameBoard()

    $scope.takeSquare = function(box) {
      if ($scope.currentPlayer == "") {
        alert("You must flip the coin to determine who goes first")
      }
      else {
        gameService.takeSquare(box, $scope.currentPlayer);
        $scope.winCheck();
        $scope.switchPlayer();
        setTimeout(console.log("Computer's Turn"), 1000)
        $scope.computerMove();
        $scope.winCheck();
        $scope.switchPlayer();
      }
    }

    $scope.winCheck = function() {
      if (gameService.checkForWinner($scope.board) === true) {
        alert($scope.currentPlayer + " has won!!")
        $scope.saveWin();
        $scope.resetBoard();
      }
    }

    $scope.switchPlayer = function() {
      $scope.currentPlayer === $scope.computerMarker ? $scope.currentPlayer = $scope.playerMarker : $scope.currentPlayer = $scope.computerMarker
    }

    $scope.resetBoard = function() {
      $scope.board = gameService.gameBoard()      
    }

    $scope.setName = function(e) {
      if (e.keyCode != 13) return;
        $scope.playerName = $scope.name
    }

    $scope.startGame = function() {
      if ($scope.currentPlayer === "") {
        $scope.currentPlayer = gameService.flipCoin();
        alert("It's "+$scope.currentPlayer+"'s turn");
        if ($scope.currentPlayer === $scope.computerMarker){
          $scope.computerMove();
          $scope.switchPlayer();
        }
      }
      else {
        alert("The game has already began! It's "+ $scope.currentPlayer + "'s turn")
      }
    }    

    $scope.saveWin = function() {
      ($scope.playerMarker === $scope.currentPlayer) ? $scope.playerRecord.wins += 1 : $scope.playerRecord.losses += 1
    }

    $scope.computerMove = function() {
      $scope.takeMiddleifOpen();
      $scope.blockOrWin();

      // if ($scope.doubleThreatAvailable()){
      //   $scope.createFlex();
      // }
      // else {
      //   alert("Hey Fucker");
      // }
    }

    // if the game board returned is not the same as the original, set the game board equal to the board returned and break out of the loop
    $scope.blockOrWin = function() {
      var newBoardRows      = gameService.blockorWinRows($scope.board, $scope.computerMarker)
      var newBoardColumns   = gameService.blockorWinColumns($scope.board, $scope.computerMarker)
      var newBoardDiagonals = gameService.blockorWinDiagonals($scope.board, $scope.computerMarker)

      if ($scope.board !== newBoardRows){
        $scope.board = newBoardRows;
      }
      else if ($scope.board !== newBoardColumns) {
        $scope.board = newBoardColumns;
      }
      else if ($scope.board !== newBoardColumns){
        $scope.board = newBoardColumns;
      }
      else {
        return false
      }
    }

    $scope.takeMiddleifOpen = function() {
      if ($scope.board[1][1].letter === "") { 
        $scope.board[1][1].letter = $scope.computerMarker
      }
    }

}])

