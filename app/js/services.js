'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var appServices = angular.module('services', []);

appServices.value('version', '0.1');

appServices.factory('gameService', 
  function(){
    return {

      gameBoard: function() {
        var board = [
          [{'id' : 'A1','letter': ''}, {'id' : 'A2','letter': ''}, {'id' : 'A3','letter': ''}],
          [{'id' : 'B1','letter': ''}, {'id' : 'B2','letter': ''}, {'id' : 'B3','letter': ''}],
          [{'id' : 'C1','letter': ''}, {'id' : 'C2','letter': ''}, {'id' : 'C3','letter': ''}]
        ]; 
        return board 
      },

      takeSquare: function(box, currentPlayer) {
        if (!box.letter) {
          box.letter = currentPlayer;
        }
        else {
          alert('select an open square!!');
        }
      },

      checkForWinner: function(board) {
        var winner = false
        if (this.checkRows(board) || this.checkColumns(board) || this.checkDiagonals(board)){
          winner = true
        }
        return winner
      },

      checkRows: function(board) {
        var foundWinner = false
        angular.forEach(board, function(row) {
          var rowContents = []
          angular.forEach(row, function(box) {
            rowContents.push(box.letter)
          })
          if (rowContents.allSameValues()) {
            foundWinner = true;
          }
        })
        return foundWinner;
      },

      checkColumns: function(board) {
        var foundWinner = false
        for (var i = 0; i < 3; i++) {
          var columnContents = []
          angular.forEach(board, function(row) {
            columnContents.push(row[i].letter);
          })
          if (columnContents.allSameValues()) {
            foundWinner = true;
          }
        }
        return foundWinner;
      },

      checkDiagonals: function(board) {
        var foundWinner = false
        var topBottom = [board[0][0].letter, board[1][1].letter, board[2][2].letter]
        var bottomTop = [board[2][0].letter, board[1][1].letter, board[0][2].letter]
        if (topBottom.allSameValues() || bottomTop.allSameValues()) {
          foundWinner = true;
        }
        return foundWinner
      },

      flipCoin: function() {
        var coin = Math.floor(Math.random() * 2);
        return (coin === 0) ? "O" : "X";
      },

      //--------------- AI logic ----------------//

      blockorWinRow: function(board, compMarker) {
        for (var row = 0; row < board.length; row++) {
          var rowContents = []
          for (var index = 0; index < board.length; index++) {
            rowContents.push(board[row][index].letter)
          }
          if (rowContents.hasTwoSameValues("X", "O") && rowContents.hasEmptyBox()) {
            var box = rowContents.indexOf("");
            board[row][box].letter = compMarker
          }
        }
        return board
      },

      blockorWinColumn: function(board, compMarker) {
        for (var col = 0; col < board.length; col++) {
          var columnContents = []
          for (var index = 0; index < board.length; index++) {
            columnContents.push(board[index][col].letter)
          }
          if (columnContents.hasTwoSameValues("X", "O") && columnContents.hasEmptyBox()) {
            var box = columnContents.indexOf("");
            board[box][col].letter = compMarker
          }
        }
        return board
      },

      blockorWinDiagonal: function(board, compMarker) {
        var topBottom = [board[0][0].letter, board[1][1].letter, board[2][2].letter]
        var bottomTop = [board[2][0].letter, board[1][1].letter, board[0][2].letter]
        if (topBottom.hasTwoSameValues("X", "O") && topBottom.hasEmptyBox()) {
          var index = topBottom.indexOf("");
          board[index][index].letter = compMarker
          return board 
        }
        else if (bottomTop.hasTwoSameValues("X", "O") && bottomTop.hasEmptyBox()){
          var box = bottomTop.indexOf("");
          board[2 - box][box].letter = compMarker // middle will never be open due to AI logic - see 'takemiddleifopen()'
          return board
        }
        else {
          return board
        }
      },

    }
  }
);

//----------- Prototypes --------------//

Array.prototype.allSameValues = function() {
  for (var i = 1; i < this.length; i++) {
    if (this[i] !== this[0] || this[0] === "") {
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
