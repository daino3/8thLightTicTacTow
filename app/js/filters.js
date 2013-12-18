'use strict';

/* Filters */

var myFilters = angular.module('filters', [])

myFilters.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);
