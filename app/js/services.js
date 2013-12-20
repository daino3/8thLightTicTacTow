'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var appServices = angular.module('services', []);

appServices.value('version', '0.1');

appServices.factory('gameService', 
  function(){
    return {
      greeting: function() {
        return "Hello"
      },

      gameBoard: function() {
        var board = [
          [{'id' : 'A1','letter': ''}, {'id' : 'A2','letter': ''}, {'id' : 'A3','letter': ''}],
          [{'id' : 'B1','letter': ''}, {'id' : 'B2','letter': ''}, {'id' : 'B3','letter': ''}],
          [{'id' : 'C1','letter': ''}, {'id' : 'C2','letter': ''}, {'id' : 'C3','letter': ''}]
        ]; 
        return board 
      },

      takeSquare: function(box) {
        if (!box.letter) {
          box.letter = playerMarker;
          // checkForWinner();
        }
        else {
          alert('select an open square!!');
        }
      }


    }
  }
);
