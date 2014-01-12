'use strict';

/* jasmine specs for services go here */

describe('services.game', function() {
  beforeEach(module('services.game'));

  describe('gameBoard', function() {
    it('should return a nested array with blank letter attributes', inject(function(gameService) {
      expect(gameService.gameBoard()[0][0].letter).toEqual("");
    }));
  });

  describe('takeSquare', function() {
    it('should make the letter attribute of gameBoard change', inject(function(gameService) {
      var game = gameService.gameBoard();
      var box = game[0][0];
      var marker = "X";
      gameService.takeSquare(box, "X");
      expect(game[0][0].letter).toEqual("X");
    }));
  });

  describe('winner', function() {
    it('should return true if someone has 3 consecutive boxes', inject(function(gameService) {
      var game = gameService.gameBoard();
      game[0][0].letter = game[0][1].letter = game[0][2].letter = "X"
      expect(gameService.winner(game)).toEqual(true);
    }));
  });

  describe('groupRows, groupColumns, groupDiagonals', function() {
    it('should return an array of rows', inject(function(gameService) {
      var game = gameService.gameBoard()
      var rows = gameService.groupRows(game)
      var columns = gameService.groupColumns(game)
      var diags = gameService.groupDiagonals(game)
      expect(rows.length).toEqual(3);
      expect(columns.length).toEqual(3);
      expect(diags.length).toEqual(2);
    }));
  });

  describe('checkRows', function() {
    it('should return true if someone wins via rows', inject(function(gameService) {
      var game1 = gameService.gameBoard()
      game1[0][0].letter = game1[0][1].letter = game1[0][2].letter = "X"
      var game2 = gameService.gameBoard()
      game2[1][0].letter = game2[1][1].letter = game2[1][2].letter = "X"      
      var game3 = gameService.gameBoard()
      game3[2][0].letter = game3[2][1].letter = game3[2][2].letter = "X"
      expect(gameService.checkRows(game1)).toEqual(true);
      expect(gameService.checkRows(game2)).toEqual(true);
      expect(gameService.checkRows(game3)).toEqual(true);
    }));
  });

  describe('checkColumns', function() {
    it('should return true if someone wins via columns', inject(function(gameService) {
      var game1 = gameService.gameBoard()
      game1[0][0].letter = game1[1][0].letter = game1[2][0].letter = "X"
      var game2 = gameService.gameBoard()
      game2[0][1].letter = game2[1][1].letter = game2[2][1].letter = "X"      
      var game3 = gameService.gameBoard()
      game3[0][2].letter = game3[1][2].letter = game3[2][2].letter = "X"
      expect(gameService.checkColumns(game1)).toEqual(true);
      expect(gameService.checkColumns(game2)).toEqual(true);
      expect(gameService.checkColumns(game3)).toEqual(true);
    }));
  });

  describe('checkDiagonals', function() {
    it('should return true if someone wins via diagonals', inject(function(gameService) {
      var game1 = gameService.gameBoard()
      game1[0][0].letter = game1[1][1].letter = game1[2][2].letter = "X"
      var game2 = gameService.gameBoard()
      game2[2][0].letter = game2[1][1].letter = game2[0][2].letter = "X"      
      expect(gameService.checkDiagonals(game1)).toEqual(true);
      expect(gameService.checkDiagonals(game2)).toEqual(true);
    }));
  });

  describe('boardFull', function() {
    it('should return true if all boxes of a board contain a letter', inject(function(gameService) {
      var game1 = [[{"letter": "X"}, {"letter": "X"}]]
      var game2 = [[{"letter": ""}, {"letter": "X"}]]
      expect(gameService.boardFull(game1)).toEqual(true);
      expect(gameService.boardFull(game2)).toEqual(false);
    }));
  });

  describe('flipCoin', function() {
    it('should return true if someone wins via columns', inject(function(gameService) {
      var player = gameService.flipCoin()
      expect(player === "X" || player === "O").toEqual(true)
    }));
  });
});
