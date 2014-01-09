'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
var ailogicServices = angular.module('services.ailogic', ['services.game']);

var EMPTY = ""
var PLAYER = "X"
var COMPUTER = "O"

ailogicServices.factory('ailogicService', 
  function(gameService){
    return {

      //------------- BLOCK OR WIN -------------//

      someoneCanWin: function(board) {
        if ( this.canWinViaRows(board) === true || this.canWinViaColumns(board) === true || this.canWinViaDiagonals(board) === true) {
          return true;
        }
        return false;
      },

      blockOrWin: function(board, compMarker) {
        if (this.canWinViaRows(board)){
          this.blockorWinRows(board, compMarker);
        }
        else if (this.canWinViaColumns(board)) {
          this.blockorWinColumns(board, compMarker);
        }
        else if (this.canWinViaDiagonals(board)){
          this.blockorWinDiagonals(board, compMarker);
        }
        else {
          return false;
        }
      },

      //---------- WIN / BLOCK: ROWS ------------//

      canWinViaRows: function(board) {
        var rows = gameService.groupRows(board);
        for (var index = 0; index < rows.length; index++) {
          if (this.canWin(rows[index])) {
            return true;
          }
        }
        return false;
      },

      blockorWinRows: function(board, compMarker) {
        var rows = gameService.groupRows(board);
        for (var index = 0; index < board.length; index++) {
          if (this.canWin(rows[index])) {
            var boxNum = rows[index].indexOf(EMPTY);
            board[index][boxNum].letter = compMarker;
          }
        }
      },

      //---------- WIN / BLOCK: COLUMNS ------------//

      canWinViaColumns: function(board) {
        var columns = gameService.groupColumns(board);
        for (var index = 0; index < columns.length; index++) {
          if (this.canWin(columns[index])) {
            return true;
          }
        }
        return false;
      },

      blockorWinColumns: function(board, compMarker) {
        var columns = gameService.groupColumns(board);
        for (var index = 0; index < columns.length; index++) {
          if (this.canWin(columns[index])) {
            var rowNum = columns[index].indexOf(EMPTY);
            board[rowNum][index].letter = compMarker;
          }
        }
      },

      //----------- WIN / BLOCK: DIAGONALS --------------//

      canWinViaDiagonals: function(board) {
        var diagonals = gameService.groupDiagonals(board);
        for (var index = 0; index < diagonals.length; index++) {
          if (this.canWin(diagonals[index])) {
            return true;
          }
        }
        return false;
      },

      blockorWinDiagonals: function(board, compMarker) {
        var diagonals = gameService.groupDiagonals(board);
        if (this.canWin(diagonals[0])) {
          var index = diagonals[0].indexOf(EMPTY);
          board[index][index].letter = compMarker; //topBottom ([0,0]->[2,2] have same number)
        }
        else if (this.canWin(diagonals[1])){
          var index = diagonals[1].indexOf(EMPTY);
          board[2 - index][index].letter = compMarker; // //bottomTop ([2,0]->[0,2] have opposite numbers; middle will never be open due to AI logic - see 'takemiddleifopen()'
        }
        else {
          return false;
        }
      },

      canWin: function(group) {
        if ((group.hasNumValues(PLAYER, 2) || group.hasNumValues(COMPUTER, 2)) && group.hasNumValues(EMPTY, 1)) {
          return true
        }
        return false
      },

      //------------------ TRAPPED --------------------//

      trapped: function(board, playerMarker, compMarker) {
        var middle   = board[1][1].letter
        var topleft  = board[0][0].letter
        var topright = board[0][2].letter
        var botleft  = board[2][0].letter
        var botright = board[2][2].letter

        if (topleft === playerMarker && botright === playerMarker && middle === compMarker) {
          return true
        }
        else if (botleft === playerMarker && topright === playerMarker && middle === compMarker) {
          return true
        }
        return false
      },

      //------------------ CREATING A 'FORK' ------------------//

      createFork: function(board, compMarker) {
        console.log("I'm HERE!!!");
        var that = this;
        if (that.topForkOpportunity(board, compMarker)) {
          that.createTopFork(board, compMarker);
        }
        else if (that.rightForkOpportunity(board, compMarker)) {
          that.createRightFork(board, compMarker);
        }
        else if (that.bottomForkOpportunity(board, compMarker)) {
          that.createBottomFork(board, compMarker);
        }
        else if (that.leftForkOpportunity(board, compMarker)) {
          that.createLeftFork(board, compMarker);
        }
        else {
          console.log("Wrong!!!");  
        }
      },

      blockFork: function(board, playerMarker, compMarker) {
        var that = this;
        if (that.topForkOpportunity(board, playerMarker)) {
          that.createTopFork(board, compMarker);
        }
        else if (that.rightForkOpportunity(board, playerMarker)) {
          that.createRightFork(board, compMarker);
        }
        else if (that.bottomForkOpportunity(board, playerMarker)) {
          that.createBottomFork(board, compMarker);
        }
        else if (that.leftForkOpportunity(board, playerMarker)) {
          that.createLeftFork(board, compMarker);
        }
        else {
          console.log("Wrong!!!");  
        }
      },

      canCreateFork: function(board, marker) {
        var opportunity = false;
        var middle = board[1][1].letter;
        if (middle === marker) {
          this.topForkOpportunity(board, marker) === true ? opportunity = true : false;
          this.rightForkOpportunity(board, marker) === true ? opportunity = true : false;
          this.bottomForkOpportunity(board, marker) === true ? opportunity = true : false;
          this.leftForkOpportunity(board, marker) === true ? opportunity = true : false;
        }
        return opportunity
      },

      topForkOpportunity: function(board, marker) {
        var topleft  = board[0][0].letter
        var topright = board[0][2].letter
        var botright = board[2][2].letter
        var botleft  = board[2][0].letter
        var midtop   = board[0][1].letter

        if (midtop === EMPTY) {
          if (topleft === marker && topright === EMPTY && botleft === EMPTY) {
            return true
          }
          else if (topright === marker && topleft === EMPTY && botright === EMPTY) {
            return true
          }
        }
        else {
          return false
        }
      },

      createTopFork: function(board, compMarker) {
        if (board[0][0].letter === EMPTY) {board[0][0].letter = compMarker;}
        if (board[0][2].letter === EMPTY) {board[0][2].letter = compMarker;}
      },

      rightForkOpportunity: function(board, marker) {
        var topleft  = board[0][0].letter
        var topright = board[0][2].letter
        var botright = board[2][2].letter
        var botleft  = board[2][0].letter
        var midright = board[1][2].letter

        if (midright === EMPTY) {
          if (topright === marker && botright === EMPTY && botleft === EMPTY) {
            return true
          }
          else if (botright === marker && topright === EMPTY && topleft === EMPTY) {
            return true
          }
        }
        else {
          return false
        }
      },

      createRightFork: function(board, compMarker) {
        if (board[2][0].letter === EMPTY) {board[2][0].letter = compMarker}
        if (board[2][2].letter === EMPTY) {board[2][2].letter = compMarker}
      },

      bottomForkOpportunity: function(board, marker) {
        var topleft  = board[0][0].letter
        var topright = board[0][2].letter
        var botright = board[2][2].letter
        var botleft  = board[2][0].letter
        var midbot   = board[1][2].letter

        if (midbot === EMPTY) {
          if (botright === marker && botleft === EMPTY && topleft === EMPTY) {
            return true
          }
          else if (botleft === marker && botright === EMPTY && topright === EMPTY) {
            return true
          }
        }
        else {
          return false
        }
      },

      createBottomFork: function(board, compMarker) {
        if (board[2][0].letter === EMPTY) {board[2][0].letter = compMarker}
        if (board[2][2].letter === EMPTY) {board[2][2].letter = compMarker}
      },

      leftForkOpportunity: function(board, marker) {
        var topleft  = board[0][0].letter
        var topright = board[0][2].letter
        var botright = board[2][2].letter
        var botleft  = board[2][0].letter
        var midleft  = board[1][2].letter

        if (midleft === EMPTY) {
          if (topleft === marker && botleft === EMPTY && botright === EMPTY) {
            return true
          }
          else if (botleft === marker && topleft === EMPTY && topright === EMPTY) {
            return true
          }
        }
        else {
          return false
        }
      },

      createLeftFork: function(board, compMarker) {
        if (board[0][0].letter === EMPTY) {board[0][0].letter = compMarker}
        if (board[2][0].letter === EMPTY) {board[2][0].letter = compMarker}
      },

      //------------------ Play Opposite Corner if Player Takes a Corner and Oppo Corner Open------------------//

      playerTookCornerandOppoCornerFree: function(board, playerMarker) {
        var diagonals = [[0,0], [0,2], [2,2], [2,0]]
        
        for (var i = 0; i < diagonals.length; i++) {
          var row = diagonals[i][0]
          var box = diagonals[i][1]
          if (board[row][box].letter === playerMarker && this.oppoCornerFree(board, diagonals[i])) {
            return true
          }
        }
        return false;
      },

      oppoCornerFree: function(board, cornerCoordinates) {
        var opporow = cornerCoordinates[0] === 2 ? 0 : 2
        var oppobox = cornerCoordinates[1] === 2 ? 0 : 2

        if (board[opporow][oppobox].letter === EMPTY) {
          return true
        }
      },

      playOppoCorner: function(board, playerMarker, compMarker) {
        var diagonals = [[0,0], [0,2], [2,2], [2,0]]
        
        for (var i = 0; i < diagonals.length; i++) {
          var row = diagonals[i][0]
          var box = diagonals[i][1]
          var opporow = diagonals[0] === 2 ? 0 : 2
          var oppobox = diagonals[1] === 2 ? 0 : 2

          if (board[row][box].letter === playerMarker && this.oppoCornerFree(board, diagonals[i])) {
            board[opporow][oppobox].letter = compMarker
            break
          }
        }
        return false;
      },

      //------------------ PLAY A CORNER IF ALL FREE (PLAYER TOOK MIDDLE) ------------------//

      cornersAreOpen: function(board) {
        var corners = this.getCorners(board)
        for (var i = 0; i < corners.length; i++) {
          if (corners[i] !== EMPTY) {return false}
        }
        return true;
      },

      takeCorner: function(board, compMarker) {
        board[0][0].letter = compMarker;
      },

      getCorners: function(board) {
        return [board[0][0].letter, board[0][2].letter, board[2][0].letter, board[2][2].letter];
      },

      // ---------------- TAKE ANY EMPTY SQUARE ----------------//

      takeEmptySquare: function(board, compMarker) {
        for (var row = 0; row < board.length; row++) {
          for (var i = 0; i < board.length; i++) {
            if (board[row][i].letter === EMPTY) {
              board[row][i].letter = compMarker
            }
          }
        }
      },

    }
  }
);