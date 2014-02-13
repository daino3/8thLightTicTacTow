'use strict';

var localGame = angular.module('controllers.localgame', ['services.game'])

var PLAYER = "X"
var OPPONENT = "O"

// SCRIPTS
var SQUARE_TAKEN = "The game has already begun!"
var FIRST_TURN   = "It's turn"
var FLIP_COIN    = "You must flip the coin to determine who goes first"
var OPEN_SQUARE  = "Select an open square!!!"
var TIE_GAME     = "Game tied"

localGame.controller('LocalGame', ['$scope', 'gameService',
  function($scope, gameService) {

    $scope.playerName = ""
    $scope.playerRecord = {wins: 0, losses: 0, ties: 0}
    $scope.playerMarker = PLAYER
    $scope.opponentMarker = OPPONENT
    $scope.currentPlayer = ""
    $scope.board = gameService.gameBoard()

    $scope.startGame = function() {
      $scope.currentPlayer = gameService.flipCoin();
      $scope.showPopUp($scope.currentPlayer+" goes first")
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
      if ($scope.currentPlayer == "") {
        $scope.showPopUp(FLIP_COIN)
      }
      else if (box.letter !== EMPTY) {
        $scope.showPopUp(OPEN_SQUARE)
      }
      else {
        gameService.takeSquare(box, $scope.currentPlayer);
        $scope.winCheck();
      }
    }

    $scope.winCheck = function() {
      if (gameService.winner($scope.board)) {
        $scope.showPopUp($scope.currentPlayer + " has won!!")
        $scope.saveWin();
        $scope.resetBoard();
      }
      else if (gameService.boardFull($scope.board)) {
        $scope.showPopUp(TIE_GAME)
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

    $scope.resetButton = function() {
      $scope.board = gameService.gameBoard()
    }

    $scope.tieGame = function() {
      $scope.playerRecord.ties += 1
    }

    $scope.setName = function(e) {
      if (e.keyCode != 13) return;
        $scope.playerName = $scope.name
    }

    $scope.saveWin = function() {
      ($scope.playerMarker === $scope.currentPlayer) ? $scope.playerRecord.wins += 1 : $scope.playerRecord.losses += 1
    }

  }])