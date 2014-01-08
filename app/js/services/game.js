'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
var gameServices = angular.module('services.game', []);

var EMPTY = "";

gameServices.factory('gameService', 
  function(){
    return {

      gameBoard: function() {
        var board = [
          [{'id' : 'A1','letter': EMPTY}, {'id' : 'A2','letter': EMPTY}, {'id' : 'A3','letter': EMPTY}],
          [{'id' : 'B1','letter': EMPTY}, {'id' : 'B2','letter': EMPTY}, {'id' : 'B3','letter': EMPTY}],
          [{'id' : 'C1','letter': EMPTY}, {'id' : 'C2','letter': EMPTY}, {'id' : 'C3','letter': EMPTY}]
        ]; 
        return board 
      },

      takeSquare: function(box, currentPlayer) {
        box.letter = currentPlayer;
      },

      winner: function(board) {
        if (this.checkRows(board) || this.checkColumns(board) || this.checkDiagonals(board)){
          return true
        }
        return false
      },

      //----------- Rows -------------//

      checkRows: function(board) {
        var rows = this.groupRows(board)
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].allSameValues()) {
            return true;
          }
        }
        return false;
      },

      groupRows: function(board){
        var b = board
        var firstRow  = [b[0][0].letter, b[0][1].letter, b[0][2].letter]
        var secondRow = [b[1][0].letter, b[1][1].letter, b[1][2].letter]
        var thirdRow  = [b[2][0].letter, b[2][1].letter, b[2][2].letter]
        var rows = [firstRow, secondRow, thirdRow]
        return rows
      },

      //----------- Columns -------------//

      checkColumns: function(board) {
        var columns = this.groupColumns(board)
        for (var i = 0; i < columns.length; i++) {
          if (columns[i].allSameValues()) {
            return true;
          }
        }
        return false;
      },

      groupColumns: function(board) {
        var b = board
        var firstColumn  = [b[0][0].letter, b[1][0].letter, b[2][0].letter]
        var secondColumn = [b[0][1].letter, b[1][1].letter, b[2][1].letter]
        var thirdColumn  = [b[0][2].letter, b[1][2].letter, b[2][2].letter]
        var columns = [firstColumn, secondColumn, thirdColumn]
        return columns
      },

      //----------- Diagonals -------------//

      checkDiagonals: function(board) {
        var diagonals = this.groupDiagonals(board)
        if (diagonals[0].allSameValues() || diagonals[1].allSameValues()) {
          return true;
        }
        return false
      },

      groupDiagonals: function(board) {
        var b = board
        var topBottom = [b[0][0].letter, b[1][1].letter, b[2][2].letter]
        var bottomTop = [b[2][0].letter, b[1][1].letter, b[0][2].letter]
        var diagonals = [topBottom, bottomTop]
        return diagonals
      },

      //------------- Other ------------//

      flipCoin: function() {
        var coin = Math.floor(Math.random() * 2);
        return (coin === 0) ? "O" : "X";
      },

      //------------- Board Full ------------//

      boardFull: function(board) {
        for (var row = 0; row < board.length; row++) {
          for (var i = 0; i < board.length; i++) {
            if (board[row][i].letter === EMPTY) {return false}
          }
        }
        return true
      },

    }
  }
);

//------------- Prototypes --------------//

Array.prototype.allSameValues = function() {
  for (var i = 1; i < this.length; i++) {
    if (this[i] !== this[0] || this[0] === EMPTY) {
      return false; 
    }
  } 
  return true;
}

Array.prototype.hasTwoSameValues = function(val1, val2) {
  var val1counter = 0
  var val2counter = 0
  for (var i = 0; i < this.length; i++) {
    if (this[i] === val1) {val1counter += 1}
    if (this[i] === val2) {val2counter += 1}
  }
  return (val1counter === 2 || val2counter === 2) ? true : false
}

Array.prototype.hasEmptyBox = function() {
  var empty = false
  for(var i = 0; i < this.length; i++) {
    if (this[i] === "") {empty = true}
  }
  return empty
}
