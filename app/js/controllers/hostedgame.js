'use strict';

var hostedGameCtrl = angular.module('controllers.hostedgame', ['services.game']);

hostedGameCtrl.controller('HostedGame', ['$firebase', '$scope', 'gameService',
  function($firebase, $scope, gameService) {

    var ref = new Firebase("https://tictactoe-dainer.firebaseio.com/");
    angularFire(inactivebets, $scope, "inactiveBetsList");

    $scope.playerName = EMPTY;
    $scope.playerRecord = {wins: 0, losses: 0, ties: 0}
    $scope.playerMarker = PLAYER;
    $scope.computerMarker = COMPUTER;
    $scope.currentPlayer = EMPTY;
    $scope.board = gameService.gameBoard();


}])