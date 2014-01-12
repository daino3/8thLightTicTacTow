'use strict';

/* jasmine specs for controllers go here */
 
describe('LocalGame', function(){
  beforeEach(module('controllers.localgame'))
  beforeEach(module('services.game'))
  var scope, ctrl, gs;

  beforeEach(inject(function($controller, gameService) {
    scope = {};
    ctrl = $controller('LocalGame', {$scope:scope});
    gs = gameService
  }));

  it('should instantiate a game board from gameService', function(gameService) {
    expect(scope.board).toEqual(gs.gameBoard());
  });

  it("should instantiate a player's record object with wins, losses and ties set to zero", function() {
    expect(scope.playerRecord.wins).toEqual(0);
    expect(scope.playerRecord.losses).toEqual(0);
    expect(scope.playerRecord.ties).toEqual(0);
  });

  it("the current player variable should be set to zero", function(gameService) {
    expect(scope.currentPlayer).toEqual("");
  });

  describe('startGame()', function() { 
    it("should change the value of currentPlayer", function() {
      scope.startGame()
      expect(scope.currentPlayer === "X" || scope.currentPlayer === "O").toEqual(true)
    });
  });

  describe('swtichPlayer()', function() { 
    it("should change the current Player", function() {
      var priorPlayer = scope.currentPlayer
      scope.switchPlayer()
      expect(priorPlayer !== scope.currentPlayer).toEqual(true)
    });
  });

  describe('winCheck()', function() { 
    it("should save a win", function() {
      scope.currentPlayer = "X"
      scope.board[0][0].letter = scope.board[0][1].letter = scope.board[0][2].letter = "X"
      scope.winCheck(scope.board)
      expect(scope.playerRecord.wins).toEqual(1)
    });
  });


});