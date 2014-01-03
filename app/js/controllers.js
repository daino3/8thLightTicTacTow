'use strict';

var myControllers = angular.module('controllers', ['services'])

myControllers.controller('Welcome', ['$scope', 
  function($scope) {

  }])

// ----------- LOCAL GAME ------------------//

myControllers.controller('LocalGame', ['$scope', 'gameService',
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

// ----------- AI GAME ------------------//

myControllers.controller('AIGame', ['$firebase', '$scope', 'gameService',
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

    // These are all happening - need to break these up so only run once
    $scope.blockOrWin = function() {
      $scope.board = gameService.blockorWinRow($scope.board, $scope.computerMarker)
      $scope.board = gameService.blockorWinColumn($scope.board, $scope.computerMarker)
      $scope.board = gameService.blockorWinDiagonal($scope.board, $scope.computerMarker)
    }

    $scope.takeMiddleifOpen = function() {
      if ($scope.board[1][1].letter === "") { 
        $scope.board[1][1].letter = $scope.computerMarker
      }
    }


  }])

// ----------- HOSTED GAME ------------------//

