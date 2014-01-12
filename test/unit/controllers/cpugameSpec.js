'use strict';

/* jasmine specs for controllers go here */
 
describe('CPUGame', function(){
  beforeEach(module('controllers.cpugame'))
  beforeEach(module('services.game'))
  var scope, ctrl, gs;

  beforeEach(inject(function($controller, gameService) {
    scope = {};
    ctrl = $controller('CPUGame', {$scope:scope});
    gs = gameService
  }));

  it('should instantiate a game board from gameService', function(gameService) {
    expect(scope.board).toEqual(gs.gameBoard());
  });

  describe('computerMove()', function() {
    it('should take the middle with the first move', function(gameService) {
      scope.computerMove()
      expect(scope.board[1][1].letter).toEqual("O");
    });

    it('should block the player from winning', function(gameService) {
      scope.board[0][0].letter = scope.board[1][1].letter = "X"
      scope.computerMove()
      expect(scope.board[2][2].letter).toEqual("O");
    });

    it('should win the game if possible', function(gameService) {
      scope.board[0][0].letter = scope.board[0][1].letter = "O"
      scope.computerMove()
      expect(scope.board[0][2].letter).toEqual("O");
    });
  });

});