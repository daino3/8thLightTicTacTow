'use strict';

var cpuGameCtrl = angular.module('controllers.cpugame', ['services.game', 'services.cpulogic'])

var EMPTY = ""
var PLAYER = "X"
var COMPUTER = "O"

cpuGameCtrl.controller('CPUGame', ['$scope', 'gameService','cpuLogicService',
  function($scope, gameService, cpuLogicService) {

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
        $scope.computerMove();
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
      cpuLogicService.computerMove($scope.board, $scope.playerMarker, $scope.computerMarker)
    }

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