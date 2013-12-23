'use strict';

/* Controllers */

var myControllers = angular.module('controllers', ['services'])

myControllers.controller('Welcome', ['$scope', 
  function($scope) {

  }])

// ----------- LOCAL GAME ------------------//

myControllers.controller('LocalGame', ['$firebase', '$scope', 'gameService',
  function($firebase, $scope, gameService) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");

    $scope.playerName = ""
    $scope.playerRecord = {wins: 0, losses: 0}
    $scope.winner = false
    $scope.playerMarker = "X"
    $scope.opponentMarker = "O"
    $scope.currentPlayer = ""
    $scope.board = gameService.gameBoard()

    $scope.takeSquare = function(box) {
      gameService.takeSquare(box, $scope.currentPlayer);
      $scope.checkForWinner();
      console.log($scope.winner);
      $scope.winner ? $scope.saveWin() : $scope.switchPlayer();
    }

    $scope.checkForWinner = function() {
      $scope.winner = gameService.checkForWinner($scope.board, $scope.winner)
    }

    $scope.switchPlayer = function() {
      ($scope.currentPlayer == $scope.playerMarker) ? $scope.currentPlayer = $scope.opponentMarker : $scope.currentPlayer = $scope.playerMarker;
    }

    $scope.resetBoard = function() {
      $scope.board = gameService.gameBoard()      
    }

    $scope.setName = function(e) {
      if (e.keyCode != 13) return;
        $scope.playerName = $scope.name
    }

    $scope.pickwhoGoesFirst = function() {

    }    

    $scope.saveWin = function() {
      gameService.saveWin($scope.playerMarker, $scope.currentPlayer, $scope.record)
    }

  }])

// ----------- AI GAME ------------------//

myControllers.controller('AIGame', ['$firebase', '$scope', 'gameService',
  function($firebase, $scope, gameService) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");

    $scope.playerName = ""
    $scope.record = {wins: 0, losses: 0}
    $scope.winner = false
    $scope.playerMarker = "X"
    $scope.compMarker = "O"
    $scope.board = gameService.gameBoard()

    $scope.takeSquare = function(box) {
      gameService.takeSquare(box, $scope.playerMarker);
      $scope.checkForWinner();
      $scope.switchPlayer();
    }

    $scope.checkForWinner = function() {
      gameService.checkForWinner($scope.board);
    }

    $scope.switchPlayer = function() {
      $scope.playerMarker = gameService.switchPlayer($scope.winner, $scope.playerMarker);
    }

    $scope.resetBoard = function() {
      $scope.board = gameService.gameBoard();  
    }

    $scope.setName = function(e) {
      if (e.keyCode != 13) return;
        $scope.playerName = $scope.name
    }

  }])

// ----------- HOSTED GAME ------------------//