'use strict';

var hostedGameCtrl = angular.module('controllers.hostedgame', ['services.game']);

hostedGameCtrl.controller('HostedGame', ['$firebase', '$scope', 'gameService',
  function($firebase, $scope, angularFire, gameService) {

    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");
    angularFire(record, $scope, "playerRecord");

    $scope.playerName = EMPTY;
    $scope.playerRecord = {wins: 0, losses: 0, ties: 0}
    $scope.playerMarker = PLAYER;
    $scope.computerMarker = COMPUTER;
    $scope.currentPlayer = EMPTY;
    $scope.board = gameService.gameBoard();


}])