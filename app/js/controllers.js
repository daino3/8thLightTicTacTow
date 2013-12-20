'use strict';

/* Controllers */

var myControllers = angular.module('controllers', ['services'])

myControllers.controller('Welcome', ['$scope', 'gameService', 
  function($scope, gameService) {

    $scope.message = "" 

    $scope.sayGreeting = function() {
      $scope.message = gameService.greeting(); // calls greeting function fom gameService
    }
  }])

// ----------- LOCAL GAME ------------------//

myControllers.controller('LocalGame', ['$firebase', '$scope', 'gameService',
  function($firebase, $scope, gameService) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");

    // $scope.wins = []
    // $scope.losses = []
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
      gameService.checkForWinner($scope.board)
    }

    $scope.switchPlayer = function() {
      $scope.playerMarker = gameService.switchPlayer($scope.winner, $scope.playerMarker)
    }

    $scope.resetBoard = function() {
      $scope.board = gameService.gameBoard()      
    }

    // $scope.gameOver = function() {

    // }

  }])

// ----------- AI GAME ------------------//

myControllers.controller('AIGame', ['$firebase', '$scope', 'gameService',
  function($firebase, $scope, gameService) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");

    // $scope.wins = []
    // $scope.losses = []
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
      gameService.checkForWinner($scope.board)
    }

    $scope.switchPlayer = function() {
      $scope.playerMarker = gameService.switchPlayer($scope.winner, $scope.playerMarker)
    }

    $scope.resetBoard = function() {
      $scope.board = gameService.gameBoard()      
    }

  }])