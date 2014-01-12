'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
var gameServices = angular.module('services.game', []);

var EMPTY = "";
var PLAYER1 = "X";
var PLAYER2 = "O"

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
        return (this.checkRows(board) || this.checkColumns(board) || this.checkDiagonals(board)) ? true : false 
      },

      //----------- ROWS -------------//

      checkRows: function(board) {
        var rows = this.groupRows(board);
        return this.checkGroups(rows);
      },


      groupRows: function(board){
        var firstRow  = [board[0][0], board[0][1], board[0][2]].mapToLetters();
        var secondRow = [board[1][0], board[1][1], board[1][2]].mapToLetters();
        var thirdRow  = [board[2][0], board[2][1], board[2][2]].mapToLetters();
        var rows = [firstRow, secondRow, thirdRow]
        return rows
      },

      //----------- COLUMNS -------------//

      checkColumns: function(board) {
        var columns = this.groupColumns(board)
        return this.checkGroups(columns);
      },

      groupColumns: function(board) {
        var firstColumn  = [board[0][0], board[1][0], board[2][0]].mapToLetters();
        var secondColumn = [board[0][1], board[1][1], board[2][1]].mapToLetters();
        var thirdColumn  = [board[0][2], board[1][2], board[2][2]].mapToLetters();
        var columns = [firstColumn, secondColumn, thirdColumn]
        return columns
      },

      //----------- DIAGONALS -------------//

      checkDiagonals: function(board) {
        var diagonals = this.groupDiagonals(board)
        return this.checkGroups(diagonals);
      },

      groupDiagonals: function(board) {
        var topBottom = [board[0][0], board[1][1], board[2][2]].mapToLetters();
        var bottomTop = [board[2][0], board[1][1], board[0][2]].mapToLetters();
        var diagonals = [topBottom, bottomTop]
        return diagonals
      },

      //------------- CHECK GROUPINGS ------------//

      checkGroups: function(groups) {
        for (var i = 0; i < groups.length; i++) {
          if (groups[i].allSameValues()) {return true;}
        }
        return false;        
      },

      //------------- BOARD FULL ------------//

      boardFull: function(board) {
        for (var row = 0; row < board.length; row++) {
          for (var i = 0; i < board.length; i++) {
            if (board[row][i].letter === EMPTY) {return false}
          }
        }
        return true
      },

      //------------- OTHER ------------//

      flipCoin: function() {
        var coin = Math.floor(Math.random() * 2);
        return (coin === 0) ? PLAYER2 : PLAYER1;
      },
    }
  }
);

//------------- PROTOTYPES --------------//

Array.prototype.allSameValues = function() {
  for (var i = 1; i < this.length; i++) {
    if (this[i] !== this[0] || this[0] === EMPTY) {
      return false; 
    }
  } 
  return true;
}

Array.prototype.hasNumValues = function(val, num) {
  var values = this.filter(function(e) {return e === val}).length
  return values === num ? true : false
}

Array.prototype.mapToLetters = function() {
  for (var i = 0; i < this.length; i++) {
    this[i] = this[i].letter
  }
  return this
}