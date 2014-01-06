'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
var ailogicServices = angular.module('services.ailogic', ['services.game']);

var EMPTY = ""

ailogicServices.factory('ailogicService', 
  function(gameService){
    return {

      //------ Blocking or Winnning --------//

      blockOrWin: function(board, compMarker) {
        if (this.canWinViaRows(board)){
          this.blockorWinRows(board, compMarker);
        }
        else if (this.canWinViaColumns(board)) {
          this.blockorWinColumns(board, compMarker)
        }
        else if (this.canWinViaDiagonals(board)){
          this.blockorWinDiagonals(board, compMarker)
        }
        else {
          return false
        }
      },

      someoneCanWin: function(board) {
        if ( this.canWinViaRows(board) === true || this.canWinViaColumns(board) === true || this.canWinViaDiagonals(board) === true) {
          return true
        }
        return false
      },

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
            var boxNum = rows[index].indexOf(EMPTY);
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
            var rowNum = columns[index].indexOf(EMPTY);
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

      blockorWinDiagonals: function(board, compMarker) {
        var diagonals = gameService.groupDiagonals(board)
        if (diagonals[0].hasTwoSameValues("X", "O") && diagonals[0].hasEmptyBox()) {
          var index = diagonals[0].indexOf(EMPTY);
          board[index][index].letter = compMarker //topBottom ([0,0]->[2,2] have same number)
        }
        else if (diagonals[1].hasTwoSameValues("X", "O") && diagonals[1].hasEmptyBox()){
          var index = diagonals[1].indexOf(EMPTY);
          board[2 - index][index].letter = compMarker // //bottomTop ([2,0]->[0,2] have opposite numbers; middle will never be open due to AI logic - see 'takemiddleifopen()'
        }
        else {
          return false
        }
      },

      //------------------ Creating a 'Fork' ------------------//

      createFork: function(board, compMarker) {
        console.log("I'm HERE!!!")
        var that = this
        if (that.topForkOpportunity(board, compMarker)) {
          that.createTopFork(board, compMarker)
        }
        else if (that.leftForkOpportunity(board, compMarker)) {
          that.createLeftFork(board, compMarker)
        }
        else if (that.bottomForkOpportunity(board, compMarker)) {
          that.createBottomFork(board, compMarker)
        }
        else if (that.rightForkOpportunity(board, compMarker)) {
          that.createRightFork(board, compMarker)
        }
        else {
          console.log("Wrong!!!")  
        }
      },

    canCreateFork: function(board, compMarker) {
      // computer must have middle square
      return ((board[1][1].letter === compMarker) && (topForkOpportunity(board, compMarker) || leftForkOpportunity(board, compMarker) || bottomForkOpportunity(board, compMarker) || rightForkOpportunity(board, compMarker)))
    },

    topForkOpportunity: function(board, compMarker) {
      var opportunity = true;
      (board[0][0].letter === compMarker || board[0][2].letter === compMarker) === false ? opportunity = false : true // a top corner square belongs to the computer 
      (board[0][1].letter === EMPTY) === false ? opportunity = false : true // middle top is open
      (board[2][0].letter === EMPTY || board[2][2].letter === EMPTY) ===  false ? opportunity = false : true // either bottom corners are open
      return opportunity
    },

    createTopFork: function(board, compMarker) {
      if (board[0][0] === EMPTY) {board[0][0] = compMarker}
      if (board[0][2] === EMPTY) {board[0][2] = compMarker}
    },

    leftForkOpportunity: function(board, compMarker) {
      var opportunity = true
      (board[0][0].letter === compMarker || board[2][0].letter === compMarker) === false ? opportunity = false : true// a left corner square belongs to the computer 
      (board[1][0].letter === EMPTY) === false ? opportunity = false : true// middle left is open  
      (board[0][2].letter === EMPTY || board[2][2].letter === EMPTY) === false ? opportunity = false : true// either right corners are open
      return opportunity 
    },

    createLeftFork: function(board, compMarker) {
      if (board[0][0] === EMPTY) {board[0][0] = compMarker}
      if (board[2][0] === EMPTY) {board[2][0] = compMarker}
    },

    bottomForkOpportunity: function(board, compMarker) {
      var opportunity = true
      (board[2][0].letter === compMarker || board[2][2].letter === compMarker) === false ? opportunity = false : true// a bottom corner already belongs to computer 
      (board[2][0].letter === EMPTY) === false ? opportunity = false : true// middle bottom is open
      (board[0][0].letter === EMPTY || board[0][2].letter === EMPTY) === false ? opportunity = false : true// either top corners are open
      return opportunity 
    },

    createBottomFork: function(board, compMarker) {
      if (board[2][0] === EMPTY) {board[2][0] = compMarker}
      if (board[2][2] === EMPTY) {board[2][2] = compMarker}
    },

    rightForkOpportunity: function(board, compMarker) {
      var opportunity = true
      (board[0][2].letter === compMarker || board[2][2].letter === compMarker) === false ? opportunity = false : true // a right corner already belongs to computer 
      (board[1][2].letter === EMPTY) === false ? opportunity = false : true // middle bottom is open
      (board[0][0].letter === EMPTY || board[0][2].letter === EMPTY) === false ? opportunity = false : true // either top corners are open
      return opportunity 
    },

    createRightFork: function(board, compMarker) {
      if (board[2][0] === EMPTY) {board[2][0] = compMarker}
      if (board[2][2] === EMPTY) {board[2][2] = compMarker}
    },

    //------------------ Other CPU Moves ------------------//

    playOppoCorner: function(board, playerMarker, compMarker) {
      var topleft  = board[0][0].letter
      var topright = board[0][2].letter
      var botleft  = board[2][0].letter
      var botright = board[2][2].letter
      if ((topleft === playerMarker) && (botright === EMPTY)) {
        board[2][2].letter = compMarker
      }
      else if ((topright === playerMarker) && (botleft === EMPTY)) {
        board[2][0].letter = compMarker
      }
      else if ((botleft === playerMarker) && (topright === EMPTY)) {
        board[0][2].letter = compMarker
      }
      else if ((botright === playerMarker) && (topleft === EMPTY)) {
        board[0][0].letter = compMarker
      }
      else {
        return false
      }
    },

    takeCorner: function(board, compMarker) {
      board[0][0].letter = compMarker
    },

    allCornersFree: function(board) {
      var topleft  = board[0][0].letter
      var topright = board[0][2].letter
      var botleft  = board[2][0].letter
      var botright = board[2][2].letter
      var corners  = [topleft, topright, botleft, botright]
      for (i = 0; i < corners.length; i++) {
        if (corners[i] !== EMPTY) {
          return false
        }
      }
      return true
    },

    }
  }
);