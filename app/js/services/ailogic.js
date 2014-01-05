'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
var ailogicServices = angular.module('services.ailogic', ['services.game']);

ailogicServices.factory('ailogicService', 
  function(gameService){
    return {

      //---------- Rows ------------//

      canWinViaRows: function(board) {
        var rows = gameService.groupRows(board)
        for (var index = 0; index < rows.length; index++) {
          if (rows[index].hasTwoSameValues("X", 'O') && rows[index].hasEmptyBox()) {
            return true 
          }
        }
        return false
      },

      blockorWinRows: function(board, compMarker) {
       var rows = gameService.groupRows(board)
        for (var index = 0; index < board.length; index++) {
          if (rows[index].hasTwoSameValues("X", 'O') && rows[index].hasEmptyBox()) {
            var boxNum = rows[index].indexOf("");
            board[index][boxNum].letter = compMarker
          }
        }
      },

      //---------- Columns ------------//

      canWinViaColumns: function(board) {
        var columns = gameService.groupColumns(board)
        for (var index = 0; index < columns.length; index++) {
          if (columns[index].hasTwoSameValues("X", 'O') && columns[index].hasEmptyBox()) {
            return true 
          }
        }
        return false
      },

      blockorWinColumns: function(board, compMarker) {
        var columns = gameService.groupColumns(board)
        for (var index = 0; index < columns.length; index++) {
          if (columns[index].hasTwoSameValues("X", 'O') && columns[index].hasEmptyBox()) {
            var rowNum = columns[index].indexOf("");
            board[rowNum][index].letter = compMarker
          }
        }
      },

      //----------- Diagonals --------------//

      canWinViaDiagonals: function(board) {
        var diagonals = gameService.groupDiagonals(board)
        for (var index = 0; index < diagonals.length; index++) {
          if (diagonals[index].hasTwoSameValues("X", 'O') && diagonals[index].hasEmptyBox()) {
            return true 
          }
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

      blockorWinDiagonals: function(board, compMarker) {
        var diagonals = gameService.groupDiagonals(board)
        if (diagonals[0].hasTwoSameValues("X", "O") && diagonals[0].hasEmptyBox()) {
          var index = diagonals[0].indexOf("");
          board[index][index].letter = compMarker //topBottom ([0,0]->[2,2] have same number)
        }
        else if (diagonals[1].hasTwoSameValues("X", "O") && diagonals[1].hasEmptyBox()){
          var index = diagonals[1].indexOf("");
          board[2 - index][index].letter = compMarker // //bottomTop ([2,0]->[0,2] have opposite numbers; middle will never be open due to AI logic - see 'takemiddleifopen()'
        }
        else {
          return false
        }
      },

    }
  }
);