'use strict';

var localGame = angular.module('controllers.localgame', ['services.game'])

localGame.controller('LocalGame', ['$scope', 'gameService',
  function($scope, gameService) {
    
    $scope.playerName = ""
    $scope.playerRecord = {wins: 0, losses: 0, ties: 0}
    $scope.playerMarker = "X"
    $scope.opponentMarker = "O"
    $scope.currentPlayer = ""
    $scope.board = gameService.gameBoard()

    $scope.takeSquare = function(box) {
      if ($scope.currentPlayer == "") {
        alert("You must flip the coin to determine who goes first")
      }
      else {
        gameService.takeSquare(box, $scope.currentPlayer);
        $scope.winCheck();
      } 
    }

    $scope.winCheck = function() {
      if (gameService.checkForWinner($scope.board) === true) {
        alert($scope.currentPlayer + " has won!!")
        $scope.saveWin();
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