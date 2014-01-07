'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
var ailogicServices = angular.module('services.ailogic', ['services.game']);

var EMPTY = ""

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
          if (rows[index].hasTwoSameValues("X", 'O') && rows[index].hasEmptyBox()) {
            return true;
          }
        }
        return false;
      },

      blockorWinRows: function(board, compMarker) {
       var rows = gameService.groupRows(board);
        for (var index = 0; index < board.length; index++) {
          if (rows[index].hasTwoSameValues("X", 'O') && rows[index].hasEmptyBox()) {
            var boxNum = rows[index].indexOf(EMPTY);
            board[index][boxNum].letter = compMarker;
          }
        }
      },

      //---------- WIN / BLOCK: COLUMNS ------------//

      canWinViaColumns: function(board) {
        var columns = gameService.groupColumns(board);
        for (var index = 0; index < columns.length; index++) {
          if (columns[index].hasTwoSameValues("X", 'O') && columns[index].hasEmptyBox()) {
            return true;
          }
        }
        return false;
      },

      blockorWinColumns: function(board, compMarker) {
        var columns = gameService.groupColumns(board);
        for (var index = 0; index < columns.length; index++) {
          if (columns[index].hasTwoSameValues("X", 'O') && columns[index].hasEmptyBox()) {
            var rowNum = columns[index].indexOf(EMPTY);
            board[rowNum][index].letter = compMarker;
          }
        }
      },

      //----------- WIN / BLOCK: DIAGONALS --------------//

      canWinViaDiagonals: function(board) {
        var diagonals = gameService.groupDiagonals(board);
        for (var index = 0; index < diagonals.length; index++) {
          if (diagonals[index].hasTwoSameValues("X", 'O') && diagonals[index].hasEmptyBox()) {
            return true;
          }
        }
        return false;
      },

      blockorWinDiagonals: function(board, compMarker) {
        var diagonals = gameService.groupDiagonals(board);
        if (diagonals[0].hasTwoSameValues("X", "O") && diagonals[0].hasEmptyBox()) {
          var index = diagonals[0].indexOf(EMPTY);
          board[index][index].letter = compMarker; //topBottom ([0,0]->[2,2] have same number)
        }
        else if (diagonals[1].hasTwoSameValues("X", "O") && diagonals[1].hasEmptyBox()){
          var index = diagonals[1].indexOf(EMPTY);
          board[2 - index][index].letter = compMarker; // //bottomTop ([2,0]->[0,2] have opposite numbers; middle will never be open due to AI logic - see 'takemiddleifopen()'
        }
        else {
          return false;
        }
      },

      //------------------ CREATING A 'FORK' ------------------//

      createFork: function(board, compMarker) {
        console.log("I'm HERE!!!");
        var that = this;
        if (that.topForkOpportunity(board, marker)) {
          that.createTopFork(board, compMarker);
        }
        else if (that.leftForkOpportunity(board, marker)) {
          that.createLeftFork(board, compMarker);
        }
        else if (that.bottomForkOpportunity(board, marker)) {
          that.createBottomFork(board, compMarker);
        }
        else if (that.rightForkOpportunity(board, marker)) {
          that.createRightFork(board, compMarker);
        }
        else {
          console.log("Wrong!!!");  
        }
      },

      canCreateFork: function(board, marker) {
        var opportunity = false;
        var middle = board[1][1].letter;
        middle === marker ? true : return false;
        console.log("----Left----")
        this.leftForkOpportunity(board, marker) === true ? false : opportunity = true;
        console.log("----Top----")
        this.topForkOpportunity(board, marker) === true ? false : opportunity = true;
        console.log("----Right----")
        this.rightForkOpportunity(board, marker) === true ? false : opportunity = true;
        console.log("----Bottom----")
        this.bottomForkOpportunity(board, marker) === true ? false : opportunity = true;
        console.log("-----Total-------")
        console.log(opportunity)
        console.log("------------")
        console.log("")
        return opportunity
      },

      leftForkOpportunity: function(board, marker) {
        var opportunity = true;
        (board[0][0].letter === marker || board[2][0].letter === marker) === false ? opportunity = false : true; // a left corner square belongs to the computer / player 
        (board[1][0].letter === EMPTY) === false ? opportunity = false : true; // middle left is open  
        (board[0][2].letter === EMPTY || board[2][2].letter === EMPTY) === false ? opportunity = false : true; // either right corners are open
        console.log(opportunity)
        return opportunity;
      },

      createLeftFork: function(board, compMarker) {
        if (board[0][0] === EMPTY) {board[0][0] = compMarker}
        if (board[2][0] === EMPTY) {board[2][0] = compMarker}
      },

      topForkOpportunity: function(board, marker) {
        var opportunity = true;
        (board[0][0].letter === marker || board[0][2].letter === marker) === false ? opportunity = false : true; // a top corner square belongs to the computer / player
        (board[0][1].letter === EMPTY) === false ? opportunity = false : true; // middle top is open
        (board[2][0].letter === EMPTY || board[2][2].letter === EMPTY) ===  false ? opportunity = false : true; // either bottom corners are open
        console.log(opportunity)
        return opportunity;
      },

      createTopFork: function(board, compMarker) {
        if (board[0][0] === EMPTY) {board[0][0] = compMarker}
        if (board[0][2] === EMPTY) {board[0][2] = compMarker}
      },

      rightForkOpportunity: function(board, marker) {
        var opportunity = true;
        (board[0][2].letter === marker || board[2][2].letter === marker) === false ? opportunity = false : true; // a right corner already belongs to computer 
        (board[1][2].letter === EMPTY) === false ? opportunity = false : true; // middle bottom is open
        (board[0][0].letter === EMPTY || board[0][2].letter === EMPTY) === false ? opportunity = false : true; // either top corners are open
        console.log(opportunity)
        return opportunity;
      },

      createRightFork: function(board, compMarker) {
        if (board[2][0] === EMPTY) {board[2][0] = compMarker}
        if (board[2][2] === EMPTY) {board[2][2] = compMarker}
      },

      bottomForkOpportunity: function(board, marker) {
        var opportunity = true;
        (board[2][0].letter === marker || board[2][2].letter === marker) === false ? opportunity = false : true; // a bottom corner already belongs to computer / player
        (board[2][0].letter === EMPTY) === false ? opportunity = false : true; // middle bottom is open
        (board[0][0].letter === EMPTY || board[0][2].letter === EMPTY) === false ? opportunity = false : true; // either top corners are open
        console.log(opportunity)
        return opportunity;
      },

      createBottomFork: function(board, compMarker) {
        if (board[2][0] === EMPTY) {board[2][0] = compMarker}
        if (board[2][2] === EMPTY) {board[2][2] = compMarker}
      },


      //------------------ Play Opposite Corner if Player Takes a Corner ------------------//

      playerTookCorner: function(board, playerMarker) {
        var corners = this.getCorners(board);
        for (var i = 0; i < corners.length; i++) {
          if (corners[i] === playerMarker) {return true}
        }
        return false;
      },

      playOppoCorner: function(board, playerMarker, compMarker) {
        var topleft  = board[0][0].letter;
        var topright = board[0][2].letter;
        var botleft  = board[2][0].letter;
        var botright = board[2][2].letter;

        if (topleft === playerMarker && botright === EMPTY) {
          board[2][2].letter = compMarker;
        }
        else if (topright === playerMarker && botleft === EMPTY) {
          board[2][0].letter = compMarker;
        }
        else if (botleft === playerMarker && topright === EMPTY) {
          board[0][2].letter = compMarker;
        }
        else if (botright === playerMarker && topleft === EMPTY) {
          board[0][0].letter = compMarker;
        }
        else {
          return false;
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

      takeCorner: function(board, compMarker) {
        board[0][0].letter = compMarker;
      },

      getCorners: function(board) {
        return [board[0][0].letter, board[0][2].letter, board[2][0].letter, board[2][2].letter];
      },

      //------------------ PLAY ADJACENT CORNER ------------------//

      playAdjacentCorner: function(board, compMarker) {
        var topleft  = board[0][0].letter;
        var topright = board[0][2].letter;
        var botleft  = board[2][0].letter;
        var botright = board[2][2].letter;
        if (topleft === compMarker) {
          this.checkright(board, [0,0], compMarker);
          this.checkbelow(board, [0,0], compMarker);
        }
        else if (topright === compMarker) {
          this.checkleft(board, [0,2], compMarker);
          this.checkbelow(board, [0,2], compMarker);        
        }
        else if (botleft === compMarker) {
          this.checkright(board, [2,0], compMarker);
          this.checkabove(board, [2,0], compMarker);
        }
        else if (botright === compMarker) {
          this.checkleft(board, [2,2], compMarker);
          this.checkabove(board, [2,2], compMarker);
        }
        else {
          return false;
        }
      },

      checkleft: function(board, coordinates, compMarker) {
        // using starting coordinates to navigate      
        var row = coordinates[0];
        var box = coordinates[1];
        if ( board[row][box - 2] === EMPTY && board[row][box - 1] === EMPTY ) {
          board[row][box - 2] = compMarker;
        }
      },

      checkright: function(board, coordinates, compMarker) {
        // using starting coordinates to navigate      
        var row = coordinates[0];
        var box = coordinates[1];
        if ( board[row][box + 2] === EMPTY && board[row][box + 1] === EMPTY ) {
          board[row][box + 2] = compMarker;
        }
      },

      checkabove: function(board, coordinates, compMarker) {
        // using starting coordinates to navigate      
        var row = coordinates[0];
        var box = coordinates[1];
        if ( board[row - 2][box] === EMPTY && board[row - 1][box] === EMPTY ) {
          board[row - 2][box] = compMarker;
        }
      },

      checkbelow: function(board, coordinates, compMarker) {
        // using starting coordinates to navigate      
        var row = coordinates[0];
        var box = coordinates[1];
        if ( board[row + 2][box] === EMPTY && board[row + 1][box] === EMPTY ) {
          board[row + 2][box] = compMarker;
        }
      },


    }
  }
);