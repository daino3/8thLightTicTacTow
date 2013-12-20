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

      takeSquare: function(box, playerMarker) {
        if (!box.letter) {
          box.letter = playerMarker;
        }
        else {
          alert('select an open square!!');
        }
      },

      checkForWinner: function(board) {
        this.checkRows(board);
        this.checkColumns(board);
        this.checkDiagonals(board);
      },

      checkRows: function(board) {
        var self = this
        angular.forEach(board, function(row) {
          var rowContents = []
          angular.forEach(row, function(box) {
            rowContents.push(box.letter)
          })
          self.winCheck(rowContents)
        })
      },

      checkColumns: function(board) {
        var self = this
        for (var i = 0; i < 3; i++) {
          var columnContents = []
          angular.forEach(board, function(row) {
            columnContents.push(row[i].letter);
          })
          self.winCheck(columnContents)
        }
      },

      checkDiagonals: function(board) {
        var b = board
        var topBottom = [b[0][0].letter, b[1][1].letter, b[2][2].letter]
        var bottomTop = [b[2][0].letter, b[1][1].letter, b[0][2].letter]
        this.winCheck(topBottom);
        this.winCheck(bottomTop);
      },

      winCheck: function(group) {
        if ( group.allSameValues() ) { 
          alert("We Have a Winner!!")
        }  
      },

      switchPlayer: function(winner, playerMarker) {
        if (!winner) {
          return (playerMarker == 'X') ? "O" : "X";
        }
        else {
          alert(winner + 'has won!!')
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