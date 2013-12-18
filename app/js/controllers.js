'use strict';

/* Controllers */

var myControllers = angular.module('myApp.controllers', [])

myControllers.controller('Welcome', [
  function() {

  }])

myControllers.controller('Game', ['$firebase', '$scope',
  function($firebase, $scope) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");
    
    $scope.winner = false
    $scope.playerMarker = "X"
    $scope.board = [
      [{'id' : 'A1','letter': ''},
       {'id' : 'A2','letter': ''},
       {'id' : 'A3','letter': ''}],
      [{'id' : 'B1','letter': ''},
       {'id' : 'B2','letter': ''},
       {'id' : 'B3','letter': ''}],
      [{'id' : 'C1','letter': ''},
       {'id' : 'C2','letter': ''},
       {'id' : 'C3','letter': ''}]
    ];

    $scope.takeSquare = function(column) {
      if (!column.letter) {
        column.letter = $scope.playerMarker
        $scope.checkForWinner();
      }
      else {
        alert('select an open square!!')
      }
    };

    $scope.switchPlayer = function() {
      if (!$scope.winner) {
        $scope.playerMarker = ($scope.playerMarker == 'X') ? "O" : "X";
      }
      else {
        alert($scope.winner + 'has won!!')
      }
    };

    $scope.checkForWinner = function() {
      $scope.checkBoard();
      $scope.switchPlayer();
    }

    $scope.checkBoard = function(){
      $scope.checkRows();
      $scope.checkColumns();
      $scope.checkDiagonals();
    };

    $scope.checkRows = function(){
      angular.forEach($scope.board, function(row) {
        var collection = []
        angular.forEach(row, function(box) {
          collection.push(box.letter)
        })
        if (collection.allSameValues()) { 
          alert("We Have a Winner!!")
          $scope.gameOver = true; 
        };  
      })
    }

    $scope.checkColumns = function() {
    
    }

    $scope.checkDiagonals = function() {

    }

    $scope.gameOver = function() {

    }

  }])

Array.prototype.allSameValues = function() {
  for (var i = 1; i < this.length; i++) {
    if (this[i] !== this[0] || this[0] === "") {
      return false; 
    }
  } 
  return true;
}