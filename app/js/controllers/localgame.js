'use strict';

var localGame = angular.module('controllers.localgame', ['services.game'])

var PLAYER = "X"
var OPPONENT = "O"

localGame.controller('LocalGame', ['$scope', 'gameService',
  function($scope, gameService) {
    
    $scope.playerName = ""
    $scope.playerRecord = {wins: 0, losses: 0, ties: 0}
    $scope.playerMarker = PLAYER
    $scope.opponentMarker = OPPONENT
    $scope.currentPlayer = ""
    $scope.board = gameService.gameBoard()

    $scope.takeSquare = function(box) {
      if ($scope.currentPlayer == "") {
        alert("You must flip the coin to determine who goes first")
      }
      else if (box.letter !== EMPTY) {
        alert("Select an open square!!")
      }
      else {
        gameService.takeSquare(box, $scope.currentPlayer);
        $scope.winCheck();
      } 
    }

    $scope.winCheck = function() {
      if (gameService.winner($scope.board)) {
        alert($scope.currentPlayer + " has won!!")
        $scope.saveWin();
        $scope.resetBoard();
      }
      else if (gameService.boardFull($scope.board)) {
        alert("Game is a tie")
        $scope.tieGame()
        $scope.resetBoard();
      }
      else {
        $scope.switchPlayer();
      }
    }

    $scope.switchPlayer = function() {
      $scope.currentPlayer = ($scope.currentPlayer === $scope.playerMarker) ? $scope.opponentMarker : $scope.playerMarker;
    }

    $scope.resetBoard = function() {
      $scope.board = gameService.gameBoard()      
    }

    $scope.tieGame = function() {
      $scope.playerRecord.ties += 1
    }

    $scope.setName = function(e) {
      if (e.keyCode != 13) return;
        $scope.playerName = $scope.name
    }

    $scope.startGame = function() {
      if ($scope.currentPlayer === "") {
        $scope.currentPlayer = gameService.flipCoin();
        alert("It's "+$scope.currentPlayer+"'s turn");
      }
      else {
        alert("The game has already began! It's "+ $scope.currentPlayer + "'s turn")
      }
    }    

    $scope.saveWin = function() {
      ($scope.playerMarker === $scope.currentPlayer) ? $scope.playerRecord.wins += 1 : $scope.playerRecord.losses += 1
    }

  }])