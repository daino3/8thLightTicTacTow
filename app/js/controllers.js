'use strict';

/* Controllers */

var myControllers = angular.module('myApp.controllers', [])

myControllers.controller('Welcome', [
  function() {

  }])

myControllers.controller('Game', ['$firebase', '$scope',
  function($firebase, $scope) {
    
    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");
    
    $scope.messages = $firebase(ref);
    $scope.playerMarker = "X"
    $scope.rows = [
      [{'id' : 'A1','letter': '','class': 'box'},
       {'id' : 'A2','letter': '','class': 'box'},
       {'id' : 'A3','letter': '','class': 'box'}],
      [{'id' : 'B1','letter': '','class': 'box'},
       {'id' : 'B2','letter': '','class': 'box'},
       {'id' : 'B3','letter': '','class': 'box'}],
      [{'id' : 'C1','letter': '','class': 'box'},
       {'id' : 'C2','letter': '','class': 'box'},
       {'id' : 'C3','letter': '','class': 'box'}]
    ];
    
    $scope.addMessage = function(e) {
      if (e.keyCode != 13) return;
      $scope.messages.$add({from: $scope.name, body: $scope.msg});
      $scope.msg = "";
    };

    $scope.takeSquare = function(column) {
      column.letter = $scope.playerMarker
      // var element = angular.element(column.target)
      // element.append($currentPlayer);
      // $scope.switchTurn();
      $scope.switchTurn();
    };

    $scope.switchTurn = function() {
      // console.log($scope.rows[0][0].letter = "O")
      // console.log($scope.rows[1][0].letter = "O")
      // console.log($scope.rows[2][0].letter = "O")
    };

    $scope.playGame = function(gameObject) {

    }

    $scope.playCenter = function(rows) {

    }

  }])

