'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ngRoute',
  'filters',
  'directives',
  'services.cpulogic',
  'services.game',
  'controllers.welcome',
  'controllers.localgame',
  'controllers.cpugame',
  'controllers.hostedgame',
  'firebase'
])

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/welcome', {templateUrl: 'partials/welcome.html', controller: 'Welcome'});
  $routeProvider.when('/localgame', {templateUrl: 'partials/game.html', controller: 'LocalGame'});
  $routeProvider.when('/CPUgame', {templateUrl: 'partials/game.html', controller: 'CPUGame'});
  $routeProvider.when('/hostedgame', {templateUrl: 'partials/game.html', controller: 'HostedGame'});
  $routeProvider.otherwise({redirectTo: '/welcome'});
}]);
