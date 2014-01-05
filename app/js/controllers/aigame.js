'use strict';

var aiGameCtrl = angular.module('controllers.aigame', ['services.game', 'services.ailogic'])

aiGameCtrl.controller('AIGame', ['$firebase', '$scope', 'gameService','ailogicService',
  function($firebase, $scope, gameService, ailogicService) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");

    $scope.playerName = ""
    $scope.playerRecord = {wins: 0, losses: 0, ties: 0}
    $scope.playerMarker = "X"
    $scope.computerMarker = "O"
    $scope.currentPlayer = ""
    $scope.board = gameService.gameBoard()

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

    $scope.computerMove = function() {
      if ($scope.middleIsOpen()) {
        $scope.takeMiddle();
      }
      else if ($scope.someoneCanWin()) {
        $scope.blockOrWin();      
      }
      else if ($scope.canCreateFork) {
        $scope.createFork();
      }
      else {
        $scope.playOppoCorner($scope.board, $scope.playerMarker, $scope.computerMarker);
      }
    }

    $scope.blockOrWin = function() {
      if ($scope.canWinViaRows()){
        ailogicService.blockorWinRows($scope.board, $scope.computerMarker);
      }
      else if ($scope.canWinViaColumns()) {
        ailogicService.blockorWinColumns($scope.board, $scope.computerMarker)
      }
      else if ($scope.canWinViaDiagonals()){
        ailogicService.blockorWinDiagonals($scope.board, $scope.computerMarker)
      }
      else {
        return false
      }
    }

    $scope.someoneCanWin = function() {
      if ( $scope.canWinViaRows() === true || $scope.canWinViaColumns() === true || $scope.canWinViaDiagonals() === true) {
        return true
      }
      return false
    }

    $scope.canWinViaRows = function() {
      return ailogicService.canWinViaRows($scope.board)
    }

    $scope.canWinViaColumns = function() {
      return ailogicService.canWinViaColumns($scope.board)
    }

    $scope.canWinViaDiagonals = function() {
      return ailogicService.canWinViaDiagonals($scope.board)
    }

    $scope.takeMiddle = function() {
      $scope.board[1][1].letter = $scope.computerMarker
    }

    $scope.middleIsOpen = function() {
      return ($scope.board[1][1].letter === "") ? true : false 
    }

    $scope.canCreateFork = function() {
      if ($scope.board[1][1].letter !== $scope.computerMarker) {
        return false
      }
      else if ($scope.playerHasACorner($scope.board, $scope.computerMarker)) {
        if ($scope.adjacentCornerOpen) {

        }
      }

    }

    $scope.playerHasACorner = function(board, computerMarker) {
      var corners = $scope.getCorners(board)
      for (i = 0; i < corners.length; i++) {
        if (corners[i] === $scope.computerMarker) {
          return true
        }
      }
    }

    $scope.getCorners = function(board) {
      var topleft  = board[0][0].letter
      var topright = board[0][2].letter
      var botleft  = board[2][0].letter
      var botright = board[2][2].letter
      var corners  = [topleft, topright, botleft, botright]
      return corners
    }

    $scope.playOppoCorner = function(board, playerMarker, compMarker) {
      var topleft  = board[0][0].letter
      var topright = board[0][2].letter
      var botleft  = board[2][0].letter
      var botright = board[2][2].letter
      if ((topleft === playerMarker) && (botright === "")) {
        board[2][2].letter = compMarker
      }
      else if ((topright === playerMarker) && (botleft === "")) {
        board[2][0].letter = compMarker
      }
      else if ((botleft === playerMarker) && (topright === "")) {
        board[0][2].letter = compMarker
      }
      else if ((botright === playerMarker) && (topleft === "")) {
        board[0][0].letter = compMarker
      }
      else {
        return false
      }
    }

    $scope.resetBoard = function() {
      $scope.board = gameService.gameBoard()      
    }

    $scope.setName = function(e) {
      if (e.keyCode != 13) return;
        $scope.playerName = $scope.name
    }

    $scope.saveWin = function() {
      ($scope.playerMarker === $scope.currentPlayer) ? $scope.playerRecord.wins += 1 : $scope.playerRecord.losses += 1
    }

}])

