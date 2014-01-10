// Move to this logic eventually

// var CPUMove = function(board, playerMarker, computerMarker) {
//   this.board          = board;
//   this.playerMarker   = playerMarker;
//   this.computerMarker = computerMarker;
// },

// CPUMove.prptotype.move = function() {
//   this
// }

// CPUMove.prototype.someoneCanWin = function() {
//   if ( this.canWinViaRows(board) === true || this.canWinViaColumns(board) === true || this.canWinViaDiagonals(board) === true) {
//     return true;
//   }
//   return false;
// },

// CPUMove.prototype.canWinViaRows = function() {
//   var rows = gameService.groupRows(this.board);
//   for (var index = 0; index < rows.length; index++) {
//     if (this.canWin(rows[index])) {
//       return true;
//     }
//   }
//   return false;
// },

// CPUMove.prototype.canWin = function(group) {
//   if ((group.hasNumValues(PLAYER, 2) || group.hasNumValues(COMPUTER, 2)) && group.hasNumValues(EMPTY, 1)) {
//     return true
//   }
//   return false
// },