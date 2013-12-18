8thLight Tic Tac Toe Challenge
------------------------------

### Overview of the Challenge

* It must have an unbeatable AI.  To elaborate, the computer player must never lose and it should win when possible.
* You can use any language.
* You can deploy the program however you want.  It can be a command line application if you want.
* There isn't a deadline.

### Overview of the Solution

I wrote the challenge using angularjs as a framework and used Firebase as a backend. I implemented a little more funtionality than the challenge required to become better accustomed with both. A user can create a game and play against a remote friend in the hosted version. Locally, the user can play against someone by taking turns with the mouse or against an unbeatable AI - but what's the fun of that??

### Running the app locally
```
$ scripts/web-server.js
```
The app runs on localhost:8000.

### Running unit tests

Karma and Jasmine run:
BLANK - FILL THESE IN WHEN WE WRITE TESTS

### End to end testing

Requires a webserver, node.js + `./scripts/web-server.js` or your backend server that hosts the angular static files.

* to run from console:
``` 
scripts/e2e-test.sh  
```
or
```
script/e2e-test.bat
```