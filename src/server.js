
/**
 * Author Patrick Wolleb. SH MEDIA LIMITED all Rights reserved.
 */

var express = require('express')
  , routes = require('./app/config/routes')
  , http = require('http')
  , path = require('path')
  , base64url  = require('b64url');

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose')



process.env.FACEBOOK_APP_SECRET = 'eb96c08874d3e31a1440a941dabe0c6a';

var app = express()
// express settings
require('./config/express')(app, config)


// Bootstrap routes
require('./config/routes')(app)

app.get('/', routes.index);
app.get('/api/games', routes.getGames);
//app.put('/api/games', routes.saveGame);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
