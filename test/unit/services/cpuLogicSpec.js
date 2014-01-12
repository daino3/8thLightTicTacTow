'use strict';

/* jasmine specs for services go here */
var CPU = "O"
var PLAYER = "X"

describe('services.cpuLogic', function() {
  beforeEach(module('services.cpulogic', 'services.game'));

  describe('takeSquare', function() {
    it("will change a box's letter on a gameboard", inject(function(gameService, cpuLogicService) {
      var game = gameService.gameBoard();
      var marker = "TEST"
      var coordinates = [1,1]
      cpuLogicService.takeSquare(game, coordinates, marker)

      expect(game[1][1].letter).toEqual(marker);
    }));
  });

  describe('blockorWinRows', function() {
    it("will return the coordinates of the third box if someone has two in a row", inject(function(gameService, cpuLogicService) {
      var game1 = gameService.gameBoard();
      game1[0][0].letter = game1[0][2].letter = PLAYER

      var game2 = gameService.gameBoard();
      game2[1][0].letter = game2[1][1].letter = CPU

      var game3 = gameService.gameBoard();
      game3[2][1].letter = game3[2][2].letter = CPU

      expect(cpuLogicService.blockorWinRows(game1)).toEqual([0, 1]);
      expect(cpuLogicService.blockorWinRows(game2)).toEqual([1, 2]);
      expect(cpuLogicService.blockorWinRows(game3)).toEqual([2, 0]);
    }));
  });

  describe('blockorWinColumns', function() {
    it("will return the coordinates of the third box if someone has two in a row", inject(function(gameService, cpuLogicService) {
      var game1 = gameService.gameBoard();
      game1[0][0].letter = game1[1][0].letter = PLAYER

      var game2 = gameService.gameBoard();
      game2[0][1].letter = game2[1][1].letter = CPU

      var game3 = gameService.gameBoard();
      game3[0][2].letter = game3[2][2].letter = CPU

      expect(cpuLogicService.blockorWinColumns(game1)).toEqual([2, 0]);
      expect(cpuLogicService.blockorWinColumns(game2)).toEqual([2, 1]);
      expect(cpuLogicService.blockorWinColumns(game3)).toEqual([1, 2]);
    }));
  });

  describe('blockorWinDiagonals', function() {
    it("will return the coordinates of the third box if someone has two in a row", inject(function(gameService, cpuLogicService) {
      var game1 = gameService.gameBoard();
      game1[0][0].letter = game1[1][1].letter = PLAYER

      var game2 = gameService.gameBoard();
      game2[2][2].letter = game2[1][1].letter = CPU

      expect(cpuLogicService.blockorWinDiagonals(game1)).toEqual([2, 2]);
      expect(cpuLogicService.blockorWinDiagonals(game2)).toEqual([0, 0]);
    }));
  });

  describe('createOrBlockFork', function() {
    it("will return of the coordinates which create or block a fork", inject(function(gameService, cpuLogicService) {
      var game1 = gameService.gameBoard();
      game1[0][0].letter = game1[1][1].letter = CPU
      game1[2][2].letter = game1[1][0].letter = PLAYER

      var game2 = gameService.gameBoard();
      game2[0][0].letter = game2[1][1].letter = PLAYER
      game2[2][2].letter = game2[1][0].letter = CPU

      expect(cpuLogicService.createOrBlockFork(game1, CPU, CPU)).toEqual([0, 2]);
      expect(cpuLogicService.createOrBlockFork(game2, PLAYER, CPU)).toEqual([0,2]);
    }));
  });
  
  describe('middleIsOpen', function() {
    it("will return the coordinates of the middle if it's available", inject(function(gameService, cpuLogicService) {
      var game1 = gameService.gameBoard();

      expect(cpuLogicService.middleIsOpen(game1)).toEqual([1,1]);
    }));
  });

  describe('allCornersAreOpen', function() {
    it("will return the coordinates of the top left corner if all corners are open (player took middle)", inject(function(gameService, cpuLogicService) {
      var game = gameService.gameBoard();

      expect(cpuLogicService.allCornersAreOpen(game)).toEqual([0, 0]);
    }));
  });

  describe('trapped', function() {
    it("will return the coordinates of the middle side to force a player block", inject(function(gameService, cpuLogicService) {
      var game1 = gameService.gameBoard();
      game1[0][0].letter = game1[2][2].letter = PLAYER
      game1[1][1].letter = CPU

      expect(cpuLogicService.trapped(game1, PLAYER, CPU)).toEqual([1, 0]);
    }));
  });

  describe('playOppoCorner', function() {
    it("will return the coordinates of the opposite corner of player if free", inject(function(gameService, cpuLogicService) {
      var game = gameService.gameBoard();
      game[0][0].letter = PLAYER

      expect(cpuLogicService.playOppoCorner(game, PLAYER)).toEqual([2, 2]);
    }));
  });

  describe('canGetTwoInaRow', function() {
    it("will return the coordinates of a box to get two in a row if unblocked by player", inject(function(gameService, cpuLogicService) {
      var game1 = gameService.gameBoard();
      game1[0][0].letter = CPU
      

      var game2 = gameService.gameBoard();
      game2[0][0].letter = CPU
      game2[0][1].letter = PLAYER

      var game3 = gameService.gameBoard();
      game3[0][0].letter = CPU
      game3[0][1].letter = PLAYER
      game3[1][0].letter = PLAYER

      expect(cpuLogicService.canGetTwoInaRow(game1, CPU)).toEqual([0, 1]);
      expect(cpuLogicService.canGetTwoInaRow(game2, CPU)).toEqual([1, 0]);
      expect(cpuLogicService.canGetTwoInaRow(game3, CPU)).toEqual([1, 1]);
    }));
  });

  describe('takeEmptySquare', function() {
    it("will return the coordinates of the first empty box it finds", inject(function(gameService, cpuLogicService) {
      var game = gameService.gameBoard();
      game[0][0].letter = game[0][1].letter = PLAYER
      
      expect(cpuLogicService.takeEmptySquare(game)).toEqual([0, 2]);
    }));
  });


});
