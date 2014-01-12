'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

// I gave up on implementing e2e tests because I think this is an outdated angular-seed? 
// I couldn't manipulate elements of the DOM via angular.element() and frustratingly, I couldn't 
// stop the e2e test process via pause() or debugger to play around in the console. 
// I would have tested on click function and the rendering of the board / partial

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('/app/index.html');
  });

  it('should automatically redirect to /welcome when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/welcome");
  });

});
