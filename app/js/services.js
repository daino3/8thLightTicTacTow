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
          if (rowContents.allSameValues() === true) {
            foundWinner = true;
          }
        })
        return foundWinner
      },

      checkColumns: function(board) {
        for (var i = 0; i < 3; i++) {
          var columnContents = []
          angular.forEach(board, function(row) {
            columnContents.push(row[i].letter);
          })
          if (columnContents.allSameValues()) return true;
        }
      },

      checkDiagonals: function(board) {
        var topBottom = [board[0][0].letter, board[1][1].letter, board[2][2].letter]
        var bottomTop = [board[2][0].letter, board[1][1].letter, board[0][2].letter]
        if (topBottom.allSameValues() || bottomTop.allSameValues()) return true;
      },

      flipCoin: function() {
        var coin = Math.floor(Math.random() * 2);
        return (coin === 0) ? "O" : "X";
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