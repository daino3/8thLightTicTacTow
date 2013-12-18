'use strict';

/* Controllers */

var myControllers = angular.module('controllers', ['services'])

myControllers.controller('Welcome', ['$scope', 'gameBoard', 
  function($scope, gameBoard) {
    $scope.gameBoard
  }])

// ----------- LOCAL GAME ------------------//

myControllers.controller('LocalGame', ['$firebase', '$scope', 
  function($firebase, $scope) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");

    // $scope.wins = []
    // $scope.losses = []
    $scope.winner = false
    $scope.playerMarker = "X"
    $scope.board = [
      [{'id' : 'A1','letter': ''}, {'id' : 'A2','letter': ''}, {'id' : 'A3','letter': ''}],
      [{'id' : 'B1','letter': ''}, {'id' : 'B2','letter': ''}, {'id' : 'B3','letter': ''}],
      [{'id' : 'C1','letter': ''}, {'id' : 'C2','letter': ''}, {'id' : 'C3','letter': ''}]
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

    $scope.checkForWinner = function(){
      $scope.checkRows();
      $scope.checkColumns();
      $scope.checkDiagonals();
      $scope.switchPlayer();
    };

    $scope.checkRows = function(){
      angular.forEach($scope.board, function(row) {
        var rowContents = []
        angular.forEach(row, function(box) {
          rowContents.push(box.letter)
        })
        $scope.winCheck(rowContents)
      })
    }

    $scope.checkColumns = function() {
      for (var i = 0; i < 3; i++) {
        var columnContents = []
        angular.forEach($scope.board, function(row) {
          columnContents.push(row[i].letter);
        })
        $scope.winCheck(columnContents)
      }
    }

    $scope.checkDiagonals = function() {
      var b = $scope.board
      var topBottom = [b[0][0].letter, b[1][1].letter, b[2][2].letter]
      var bottomTop = [b[2][0].letter, b[1][1].letter, b[0][2].letter]
      $scope.winCheck(topBottom)
      $scope.winCheck(bottomTop);
    }

    $scope.switchPlayer = function() {
      if (!$scope.winner) {
        $scope.playerMarker = ($scope.playerMarker == 'X') ? "O" : "X";
      }
      else {
        alert($scope.winner + 'has won!!')
      }
    };

    $scope.resetBoard = function() {
      angular.forEach($scope.board, function(row) {
        angular.forEach(row, function(box) {
          box.letter = ""
        })
      })
    }

    $scope.winCheck = function(group) {
      if ( group.allSameValues() ) { 
        alert("We Have a Winner!!")
        // $scope.gameOver = true; 
      };  
    }

    // $scope.gameOver = function() {

    // }

  }])

Array.prototype.allSameValues = function() {
  for (var i = 1; i < this.length; i++) {
    if (this[i] !== this[0] || this[0] === "") {
      return false; 
    }
  } 
  return true;
}


// ----------- AI GAME ------------------//

myControllers.controller('AIGame', ['$firebase', '$scope',
  function($firebase, $scope) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");

    // $scope.wins = []
    // $scope.losses = []
    $scope.winner = false
    $scope.playerMarker = "X"
    $scope.compMarker = "O"
    $scope.board = [
      [{'id' : 'A1','letter': ''}, {'id' : 'A2','letter': ''}, {'id' : 'A3','letter': ''}],
      [{'id' : 'B1','letter': ''}, {'id' : 'B2','letter': ''}, {'id' : 'B3','letter': ''}],
      [{'id' : 'C1','letter': ''}, {'id' : 'C2','letter': ''}, {'id' : 'C3','letter': ''}]
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

    $scope.checkForWinner = function(){
      $scope.checkRows();
      $scope.checkColumns();
      $scope.checkDiagonals();
      $scope.switchPlayer();
    };

    $scope.checkRows = function(){
      angular.forEach($scope.board, function(row) {
        var rowContents = []
        angular.forEach(row, function(box) {
          rowContents.push(box.letter)
        })
        $scope.winCheck(rowContents)
      })
    }

    $scope.checkColumns = function() {
      for (var i = 0; i < 3; i++) {
        var columnContents = []
        angular.forEach($scope.board, function(row) {
          columnContents.push(row[i].letter);
        })
        $scope.winCheck(columnContents)
      }
    }

    $scope.checkDiagonals = function() {
      var b = $scope.board
      var topBottom = [b[0][0].letter, b[1][1].letter, b[2][2].letter]
      var bottomTop = [b[2][0].letter, b[1][1].letter, b[0][2].letter]
      $scope.winCheck(topBottom)
      $scope.winCheck(bottomTop);
    }

    $scope.resetBoard = function() {
      angular.forEach($scope.board, function(row) {
        angular.forEach(row, function(box) {
          box.letter = ""
        })
      })
    }

    $scope.winCheck = function(group) {
      if ( group.allSameValues() ) { 
        alert("We Have a Winner!!")
        // $scope.gameOver = true; 
      };  
    }

    // $scope.gameOver = function() {

    // }

    $scope.aIMove = function() {

    }

  }])