'use strict';

var cpuGameCtrl = angular.module('controllers.cpugame', ['services.game', 'services.cpulogic'])

var EMPTY = ""
var PLAYER = "X"
var COMPUTER = "O"

// SCRIPTS
var SQUARE_TAKEN = "The game has already begun!"
var FIRST_TURN   = "It's turn"
var FLIP_COIN    = "You must flip the coin to determine who goes first"
var OPEN_SQUARE  = "Select an open square!!!"
var TIE_GAME     = "Game tied"

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
        $scope.showPopUp("It's "+ $scope.currentPlayer +"'s turn");
        if ($scope.currentPlayer === $scope.computerMarker){
          $scope.computerMove();
          $scope.switchPlayer();
        }
      }
      else {
        $scope.showPopUp("The game has already begun! It's "+ $scope.currentPlayer + "'s turn")
      }
      document.getElementById("start-button").disabled = true;
    }   

    $scope.showPopUp = function(message) {
      var messageDiv = document.getElementById("message-board")
      messageDiv.style.display = 'inline'
      messageDiv.innerHTML = message
      
      setTimeout(function(){
        messageDiv.style.display = 'none'
      }, 1500);
    }

    $scope.takeSquare = function(box) {
      if ($scope.currentPlayer === EMPTY) {
        $scope.showPopUp(FLIP_COIN)
      }
      else if (box.letter !== EMPTY) {
        $scope.showPopUp(OPEN_SQUARE);
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
        $scope.showPopUp($scope.currentPlayer + " has won!!");
        $scope.resetBoard();
      }
      else if (gameService.boardFull($scope.board)) {
        $scope.tieGame();
        $scope.showPopUp(TIE_GAME);
        $scope.resetBoard();
      }
    }

    $scope.switchPlayer = function() {
      $scope.currentPlayer === $scope.computerMarker ? $scope.currentPlayer = $scope.playerMarker : $scope.currentPlayer = $scope.computerMarker
    }

    $scope.tieGame = function() {
      $scope.playerRecord.ties += 1
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