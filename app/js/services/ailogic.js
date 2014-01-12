'use strict';

var EMPTY = ""
var PLAYER = "X"
var COMPUTER = "O"

var ailogicServices = angular.module('services.ailogic', ['services.game']);

ailogicServices.factory('ailogicService', 
  function(gameService){
    return {

      //-------------- Computer Logic -------------//

      computerMove: function(board, player, cpu) {
        // This logic must remain consistent
        if (this.someoneCanWin(board)) {
          this.blockOrWin(board, cpu);
        }
        else if (this.canCreateFork(board, player)) {
          this.createOrBlockFork(board, player, cpu);
        }
        else if (this.canCreateFork(board, cpu)) {
          this.createOrBlockFork(board, cpu, cpu);
        }
        else if (this.middleIsOpen(board)) {
          this.takeMiddle(board, cpu);
        }
        else if (this.cornersAreOpen(board)) {
          this.takeCorner(board, cpu);
        }
        else if (this.trapped(board, player, cpu)) {
          this.takeMiddleSide()
        }
        else if (this.playerTookCornerandOppoCornerFree(board, player)){
          this.playOppoCorner(board, player, cpu);
        }
        else if (this.canGetTwoInaRow(board, cpu)) {
          this.getTwo(board, cpu);
        }
        else {
          this.takeEmptySquare(board, cpu)
        }
      },

      //------------- BLOCK OR WIN -------------//

      someoneCanWin: function(board) {
        return (this.canWinViaRows(board) || this.canWinViaColumns(board) || this.canWinViaDiagonals(board))
      },

      blockOrWin: function(board, cpu) {
        if (this.canWinViaRows(board)){
          this.blockorWinRows(board, cpu);
        }
        else if (this.canWinViaColumns(board)) {
          this.blockorWinColumns(board, cpu);
        }
        else if (this.canWinViaDiagonals(board)){
          this.blockorWinDiagonals(board, cpu);
        }
        else {
          return false;
        }
      },

      canWinViaRows: function(board) {
        var rows = gameService.groupRows(board);
        for (var index = 0; index < rows.length; index++) {
          if (this.canWin(rows[index])) {
            return true;
          }
        }
        return false;
      },

      blockorWinRows: function(board, cpu) {
        var rows = gameService.groupRows(board);
        for (var index = 0; index < rows.length; index++) {
          if (this.canWin(rows[index])) {
            var boxNum = rows[index].indexOf(EMPTY);
            board[index][boxNum].letter = cpu;
          }
        }
      },

      canWinViaColumns: function(board) {
        var columns = gameService.groupColumns(board);
        for (var index = 0; index < columns.length; index++) {
          if (this.canWin(columns[index])) {
            return true;
          }
        }
        return false;
      },

      blockorWinColumns: function(board, cpu) {
        var columns = gameService.groupColumns(board);
        for (var index = 0; index < columns.length; index++) {
          if (this.canWin(columns[index])) {
            var rowNum = columns[index].indexOf(EMPTY);
            board[rowNum][index].letter = cpu;
          }
        }
      },

      canWinViaDiagonals: function(board) {
        var diagonals = gameService.groupDiagonals(board);
        for (var index = 0; index < diagonals.length; index++) {
          if (this.canWin(diagonals[index])) {
            return true;
          }
        }
        return false;
      },

      blockorWinDiagonals: function(board, cpu) {
        var diagonals = gameService.groupDiagonals(board);
        if (this.canWin(diagonals[0])) {
          var index = diagonals[0].indexOf(EMPTY);
          board[index][index].letter = cpu; // topBottom ([0,0]->[2,2] have same number)
        }
        else if (this.canWin(diagonals[1])){
          var index = diagonals[1].indexOf(EMPTY);
          board[2 - index][index].letter = cpu; // bottomTop ([2,0]->[0,2] have opposite numbers; middle will never be open due to AI logic - see 'takemiddleifopen()'
        }
        else {
          return false;
        }
      },

      canWin: function(group) {
        return ((group.hasNumValues(PLAYER, 2) || group.hasNumValues(COMPUTER, 2)) && group.hasNumValues(EMPTY, 1))
      },

      //------------------ TRAPPED --------------------//

      trapped: function(board, player, cpu) {
        var middle   = board[1][1].letter
        var topleft  = board[0][0].letter
        var topright = board[0][2].letter
        var botleft  = board[2][0].letter
        var botright = board[2][2].letter

        if (topleft === player && botright === player && middle === cpu) {return true}
        else if (botleft === player && topright === player && middle === cpu) {return true}
        return false
      },

      takeMiddleSide: function(board, cpu) {
        board[1][0].letter = cpu
      },

      //------------------ TAKE MIDDLE IF OPEN ------------------//

      middleIsOpen: function(board) {
        return board[1][1].letter === EMPTY;
      },

      takeMiddle: function(board, cpu) {
        board[1][1].letter = cpu;
      },

      //------------------ CREATE A 'FORK' ------------------//

      canCreateFork: function(board, marker) {
        var topleft    = board[0][0].letter
        var topmiddle  = board[0][1].letter
        var topright   = board[0][2].letter
        var midleft    = board[1][0].letter
        var middle     = board[1][1].letter
        var midright   = board[1][2].letter
        var botleft    = board[2][0].letter
        var botmiddle  = board[2][1].letter
        var botright   = board[2][2].letter

        if (middle !== marker) {
          return false
        }
        else if (topleft === marker) {
          if (this.allEmpty([topmiddle, topright, botleft])) {return true}
          else if (this.allEmpty([midleft, botleft, topright])) {return true}
          else {return false}
        }
        else if (topright === marker) {
          if (this.allEmpty([topleft, topmiddle, botright])) {return true}
          else if (this.allEmpty([botright, midright, topleft])) {return true}
          else {return false}
        }
        else if (botright === marker) {
          if (this.allEmpty([topright, midright, botleft])) {return true}
          else if (this.allEmpty([botleft, botmiddle, topright])) {return true}
          else {return false}
        }
        else if (botleft === marker) {
          if (this.allEmpty([botright, botmiddle, topleft])) {return true}
          else if (this.allEmpty([topleft, midleft, botright])) {return true}
          else {return false}
        }
        else {return false}
      },

      createOrBlockFork: function(board, marker1, marker2) {
        var topleft    = board[0][0].letter
        var topmiddle  = board[0][1].letter
        var topright   = board[0][2].letter
        var midleft    = board[1][0].letter
        var middle     = board[1][1].letter
        var midright   = board[1][2].letter
        var botleft    = board[2][0].letter
        var botmiddle  = board[2][1].letter
        var botright   = board[2][2].letter

        if (middle !== marker1) {
          return false
        }
        else if (topleft === marker1) {
          if (this.allEmpty([topmiddle, topright, botleft])) {
            this.takeTopRightCorner(board, marker2) 
          }
          else if (this.allEmpty([midleft, botleft, topright])) {
            this.takeBotLeftCorner(board, marker2)
          }
          else {return false}
        }
        else if (topright === marker1) {
          if (this.allEmpty([topleft, topmiddle, botright])) {
            this.takeTopLeftCorner(board, marker2)
          }
          else if (this.allEmpty([botright, midright, topleft])) {
            this.takeBotRightCorner(board, marker2)
          }
          else {return false}
        }
        else if (botright === marker1) {
          if (this.allEmpty([topright, midright, botleft])) {
            this.takeTopRightCorner(board, marker2)
          }
          else if (this.allEmpty([botleft, botmiddle, topright])) {
            this.takeBotLeftCorner(board, marker2)
          }
          else {return false}
        }
        else if (botleft === marker1) {
          if (this.allEmpty([botright, botmiddle, topleft])) {
            this.takeBotRightCorner(board, marker2)
          }
          else if (this.allEmpty([topleft, midleft, botright])) {
            this.takeTopLeftCorner(board, marker2)
          }
          else {return false}
        }
        else {return false}
      },

      takeTopLeftCorner: function(board, marker) {
        board[0][0].letter = marker;
      },

      takeTopRightCorner: function(board, marker) {
        board[0][2].letter = marker;
      },

      takeBotRightCorner: function(board, marker) {
        board[2][2].letter = marker;
      },

      takeBotLeftCorner: function(board, marker) {
        board[2][0].letter = marker;
      },

      allEmpty: function(group) {
        for(var i = 0; i < group.length; i++) {
          if (group[i] !== EMPTY) {return false}
        }
        return true
      },

      //------------------ PLAY OPPOSITE CORNER IF FREE ------------------//

      playerTookCornerandOppoCornerFree: function(board, player) {
        var diagonals = [[0,0], [0,2], [2,2], [2,0]]
        
        for (var i = 0; i < diagonals.length; i++) {
          var row = diagonals[i][0]
          var box = diagonals[i][1]
          if (board[row][box].letter === player && this.oppoCornerFree(board, diagonals[i])) {return true}
        }
        return false;
      },

      oppoCornerFree: function(board, cornerCoordinates) {
        var opporow = cornerCoordinates[0] === 2 ? 0 : 2;
        var oppobox = cornerCoordinates[1] === 2 ? 0 : 2;

        return board[opporow][oppobox].letter === EMPTY;
      },

      playOppoCorner: function(board, player, cpu) {
        var diagonals = [[0,0], [0,2], [2,2], [2,0]];
        
        for (var i = 0; i < diagonals.length; i++) {
          var row = diagonals[i][0];
          var box = diagonals[i][1];
          var opporow = (row === 2) ? 0 : 2;
          var oppobox = (box === 2) ? 0 : 2;

          if (board[row][box].letter === player && this.oppoCornerFree(board, diagonals[i])) {
            board[opporow][oppobox].letter = cpu;
            break
          }
        }
        return false;
      },

      //------------------ PLAY A CORNER IF ALL FREE (PLAYER TOOK MIDDLE) ------------------//

      canGetTwoInaRow: function(board, cpu) {
        var rows  = gameService.groupRows(board);
        var cols  = gameService.groupColumns(board);
        var diags = gameService.groupDiagonals(board);
        
        if (this.checkGroups(rows, cpu)) {return true};
        if (this.checkGroups(cols, cpu)) {return true};
        if (this.checkGroups(diags, cpu)) {return true};
      },

      checkGroups: function(groups, cpu) {
        for (var i = 0; i < groups.length; i++) {
          if (this.canGetTwo(groups[i])) {return true}
        } 
        return false;
      },

      canGetTwo: function(array, cpu) {
        return (array.hasNumValues(EMPTY, 2) && array.hasNumValues(cpu, 1))
      },

      getTwo: function(board, cpu) {
        var rows  = gameService.groupRows(board);
        var cols  = gameService.groupRows(board);
        var diags = gameService.groupDiagonals(board);

        if (this.checkGroups(rows, cpu)) {
          this.getTwo_Rows(board, rows, cpu)
        }
        else if (this.checkGroups(cols, cpu)) {
          this.getTwo_Cols(board, cols, cpu)
        }
        else if (this.checkGroups(diag, cpu)) {
          this.getTwo_Diags(board, diags, cpu)
        }
      },

      getTwo_Rows: function(board, rows, cpu) {
        for (var i = 0; i < rows.length; i++) {
          if (this.canGetTwo(rows[i])) {
            var boxNum = rows[i].indexOf(EMPTY);
            board[i][boxNum].letter = cpu;
          }
        }
      },

      getTwo_Cols: function(board, cols, cpu) {
        for (var i = 0; i < columns.length; i++) {
          if (this.canGetTwo(cols[i])) {
            var rowNum = columns[i].indexOf(EMPTY);
            board[rowNum][i].letter = cpu;
          }
        }
      },

      getTwo_Diags: function(board, diags, cpu) {
        var topBottom = diags[0]
        var bottomTop = diags[1]

        if (this.canGetTwo(topBottom)) {
          var i = topBottom.indexOf(EMPTY);
          board[i][i].letter = cpu; // topBottom ([0,0]->[2,2] have same number)
        }
        else if (this.canGetTwo(bottomTop)) {
          var i = bottomTop.indexOf(EMPTY);
          board[2 - i][i].letter = cpu; // bottomTop ([2,0]->[0,2] have opposite numbers; middle will never be open due to AI logic - see 'takemiddleifopen()'
        }
      },

      //------------------ PLAY A CORNER IF ALL FREE (PLAYER TOOK MIDDLE) ------------------//

      cornersAreOpen: function(board) {
        var corners = this.getCorners(board)
        for (var i = 0; i < corners.length; i++) {
          if (corners[i] !== EMPTY) {return false}
        }
        return true;
      },

      takeCorner: function(board, cpu) {
        board[0][0].letter = cpu;
      },

      getCorners: function(board) {
        return [board[0][0], board[0][2], board[2][0], board[2][2]].mapToLetters();
      },

      // ---------------- TAKE ANY EMPTY SQUARE ----------------//

      takeEmptySquare: function(board, marker) {
        var length = board.length
        for (var row = 0; row < length; row++) {
          for (var i = 0; i < length; i++) {
            if (board[row][i].letter === EMPTY) {
              return board[row][i].letter = marker;
            }
          }
        }
      },

    }
  }
);