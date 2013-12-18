'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var appServices = angular.module('services', []);

appServices.value('version', '0.1');

appServices.factory('gameBoard', 
  function(){
    return "Hello"
  }
);
