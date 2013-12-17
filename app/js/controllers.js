'use strict';

/* Controllers */

var myControllers = angular.module('myApp.controllers', [])

myControllers.controller('MyCtrl1', ['$firebase', '$scope',
  function($firebase, $scope) {
  var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");
    $scope.messages = $firebase(ref);
    $scope.addMessage = function(e) {
      if (e.keyCode != 13) return;
      $scope.messages.$add({from: $scope.name, body: $scope.msg});
      $scope.msg = "";
    };
  }])