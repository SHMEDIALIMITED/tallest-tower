#SH MEDIA LIMITED

##Basic Web App

### Overview

The template consists of toplevel directories that should never be deployed onto a web server. The design directory should contain all design related assets such as Photoshop and After Effect files. The src folder contains the full code for running on localhost. To develop cd into src and run node server. Go to localhost:3000 to see the app running. The src directory contains a tests folder for the node backend. Inside public directory there is another test folder containig the front end tests.

###Steps to start

1. 	Delete .git dir in root and put project under version control
2.	Open and edit package.json according to your needs (remove references to SH MEDIA)
3.  npm install inside root and src directories to get dependencies
4.	Run server on localhost:3000 by typing "node src/server" from inside the root directory
5.  Edit front end tests inside src/public/test/spec
6.	Run front end tests by opening src/public/test/test.html in a browser
7.	Edit backend tests inside src/test/spec
8. 	Run backend tests by typing jasmine-node src/test/spec from inside the root directory
9. 	Build optimised version by typing grunt inside the root directory that creates the bin directory ready for deployment to a webserver 