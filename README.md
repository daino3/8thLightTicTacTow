8thLight Tic Tac Toe Challenge
------------------------------

Author: Christopher "Dain" Hall

### Overview of the Challenge

* It must have an unbeatable AI.  To elaborate, the computer player must never lose and it should win if possible.
* You can use any language.
* You can deploy the program however you want.  It can be a command line application if you want.
* There isn't a deadline.

### Overview of the Solution

I wrote the challenge using angularjs as a framework and planned to use Firebase as a backend for a hosted game. I implemented a little more funtionality than the challenge required to become better accustomed to angular and javascript. Locally, the user can play against someone by taking turns with the mouse or against an unbeatable AI. Eventually, I'll build a hosted version for two players to connect via the web.

User's will have to hit the 'flip the coin' button to start either the local game or AI Game. All the user has to do is click the desired box.

### Running the app locally

The app runs on localhost:8000. The AI game runs at http://localhost:8000/app/index.html#/CPUgame

```
$ node scripts/web-server
```


### Running unit tests
```
$ bash scripts/test.sh 
```

### End to end testing

Admittedly, I gave up on implementing e2e tests because I think this is an outdated angular-seed? I couldn't manipulate elements of the DOM via angular.element(), and frustratingly, I couldn't 
stop the e2e test process via pause() or debugger to play around in the console. I would have tested on click function and the rendering of the board / partial.

* to run from console:
``` 
$ bash scripts/e2e-test.sh  
```

note to author:
things I had to change for heroku:
1) scripts/web-server.js - added process.env.PORT to '.listen(process.env.PORT || 8888)'
2) added Procfile with 'web: node scripts/web-server.js'
3) cl:$ heroku ps:scale web=1
4) installed gzippo and express with: cl:$ npm install gzippo express --save
5) I unfortunately did not figure out how to delete the intro directory
