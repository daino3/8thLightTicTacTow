'use strict';

var EMPTY = ""
var PLAYER = "X"
var COMPUTER = "O"

var cpulogicServices = angular.module('services.cpulogic', ['services.game']);

cpulogicServices.factory('cpuLogicService', 
  function(gameService){
    return {

      //-------------- Computer Logic -------------//

      computerMove: function(board, player, cpu) {
        // This logic must remain consistent
        var bestMove = (this.blockOrWin(board) || 
                        this.createOrBlockFork(board, player, cpu) || 
                        this.createOrBlockFork(board, cpu, cpu) || 
                        this.middleIsOpen(board) || 
                        this.allCornersAreOpen(board) ||
                        this.trapped(board, player, cpu) ||
                        this.playOppoCorner(board, player) || 
                        this.canGetTwoInaRow(board, cpu) || 
                        this.takeEmptySquare(board)
                        );
        this.takeSquare(board, bestMove, cpu);
      },

      takeSquare: function(board,coordinates, cpu) {
        var row = coordinates[0]
        var box = coordinates[1]
        board[row][box].letter = cpu
      },

      //------------- BLOCK OR WIN -------------//

      blockOrWin: function(board) {
        return (this.blockorWinRows(board) || this.blockorWinColumns(board) || this.blockorWinDiagonals(board))
      },

      blockorWinRows: function(board) {
        var rows = gameService.groupRows(board);
        for (var index = 0; index < rows.length; index++) {
          if (this.canWin(rows[index])) {
            var boxNum = rows[index].indexOf(EMPTY);
            return [index, boxNum]
          }
        }
        return false
      },

      blockorWinColumns: function(board) {
        var columns = gameService.groupColumns(board);
        for (var index = 0; index < columns.length; index++) {
          if (this.canWin(columns[index])) {
            var rowNum = columns[index].indexOf(EMPTY);
            return [rowNum, index]
          }
        }
        return false
      },

      blockorWinDiagonals: function(board) {
        var diagonals = gameService.groupDiagonals(board);
        if (this.canWin(diagonals[0])) {
          var index = diagonals[0].indexOf(EMPTY);
          return [index, index] // topBottom ([0,0]->[2,2] have same number)
        }
        else if (this.canWin(diagonals[1])){
          var index = diagonals[1].indexOf(EMPTY);
          return [2 - index, index] // bottomTop ([2,0]->[0,2] have opposite numbers; middle will never be open due to AI logic - see 'takemiddleifopen()'
        }
        else { return false; }
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

        if (topleft === player && botright === player && middle === cpu) {return [1, 0]}
        else if (botleft === player && topright === player && middle === cpu) {return [1, 0]}
        else { return false }
      },

      //------------------ TAKE MIDDLE IF OPEN ------------------//

      middleIsOpen: function(board) {
        return (board[1][1].letter === EMPTY) ? [1, 1] : false
      },

      //------------------ CREATE A 'FORK' ------------------//

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
          if (this.allEmpty([topmiddle, topright, botleft])) { return [0, 2] }
          else if (this.allEmpty([midleft, botleft, topright])) { return [2, 0] }
          else {return false}
        }
        else if (topright === marker1) {
          if (this.allEmpty([topleft, topmiddle, botright])) { return [0, 0] }
          else if (this.allEmpty([botright, midright, topleft])) { return [2, 2] }
          else {return false}
        }
        else if (botright === marker1) {
          if (this.allEmpty([topright, midright, botleft])) { return [0, 2] }
          else if (this.allEmpty([botleft, botmiddle, topright])) { return [2, 0] }
          else {return false}
        }
        else if (botleft === marker1) {
          if (this.allEmpty([botright, botmiddle, topleft])) { return [2, 2] }
          else if (this.allEmpty([topleft, midleft, botright])) { return [0, 0] }
          else {return false}
        }
        else {return false}
      },

      allEmpty: function(group) {
        for(var i = 0; i < group.length; i++) {
          if (group[i] !== EMPTY) {return false}
        }
        return true
      },

      //------------------ PLAY OPPOSITE CORNER IF FREE ------------------//

      playOppoCorner: function(board, player) {
        var diagonals = [[0,0], [0,2], [2,2], [2,0]]
        
        for (var i = 0; i < diagonals.length; i++) {
          var row = diagonals[i][0]
          var box = diagonals[i][1]
          var opporow = (row === 2) ? 0 : 2;
          var oppobox = (box === 2) ? 0 : 2;
          if (board[row][box].letter === player && board[opporow][oppobox].letter === EMPTY) {
            return [opporow, oppobox]
          }
        }
        return false;
      },

      //------------------ GET TWO IN A ROW ------------------//

      canGetTwoInaRow: function(board, cpu) {
        var rows  = gameService.groupRows(board);
        var cols  = gameService.groupColumns(board);
        var diags = gameService.groupDiagonals(board);
        
        return (this.getTwo_Rows(rows, cpu) || this.getTwo_Cols(cols, cpu) || this.getTwo_Diags(diags, cpu))
      },

      canGetTwo: function(array, cpu) {
        return (array.hasNumValues(EMPTY, 2) && array.hasNumValues(cpu, 1))
      },

      getTwo_Rows: function(rows, cpu) {
        for (var i = 0; i < rows.length; i++) {
          if (this.canGetTwo(rows[i], cpu)) {
            var boxNum = rows[i].indexOf(EMPTY);
            return [i, boxNum];
          }
        }
        return false
      },

      getTwo_Cols: function(cols, cpu) {
        for (var i = 0; i < cols.length; i++) {
          if (this.canGetTwo(cols[i], cpu)) {
            var rowNum = cols[i].indexOf(EMPTY);
            return [rowNum, i]
          }
        }
        return false
      },

      getTwo_Diags: function(diags, cpu) {
        var topBottom = diags[0]
        var bottomTop = diags[1]

        if (this.canGetTwo(topBottom, cpu)) {
          var i = topBottom.indexOf(EMPTY);
          return [i, i] // topBottom ([0,0]->[2,2] have same number)
        }
        else if (this.canGetTwo(bottomTop, cpu)) {
          var i = bottomTop.indexOf(EMPTY);
          return [2 - i, i] // bottomTop ([2,0]->[0,2] have opposite numbers; middle will never be open due to AI logic - see 'takemiddleifopen()'
        }
        else { return false }
      },

      //------------------ PLAY A CORNER IF ALL FREE (PLAYER TOOK MIDDLE) ------------------//

      allCornersAreOpen: function(board) {
        var corners = this.getCorners(board)
        for (var i = 0; i < corners.length; i++) {
          if (corners[i] !== EMPTY) {return false}
        }
        return [0, 0]
      },

      getCorners: function(board) {
        return [board[0][0], board[0][2], board[2][0], board[2][2]].mapToLetters();
      },

      // ---------------- TAKE ANY EMPTY SQUARE ----------------//

      takeEmptySquare: function(board) {
        var length = board.length
        for (var row = 0; row < length; row++) {
          for (var i = 0; i < length; i++) {
            if (board[row][i].letter === EMPTY) {
              return [row, i]
            }
          }
        }
      },

    }
  }
);