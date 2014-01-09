'use strict';


var gameServices = angular.module('services.game', []);

aiGameCtrl.controller('AIGame', ['$firebase', '$scope', 'gameService','ailogicService',
  function($firebase, $scope, gameService, ailogicService) {

    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");