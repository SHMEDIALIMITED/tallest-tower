var Models = require('../models');
var base64url = require('b64url');

module.exports = function(config) {

    var Game = Models.Game;
    var Feature = Models.Feature;
    var User = Models.User;
    var GameData = Models.GameData;

	var api = {};

	api.read = function(req,res) {
        if(req.userID) {
            User.findOne({fbID: req.userID}, function(err, user) {
               Game.find({'_id' : { $in: user.games }}, function(err, games) {
                    res.send(games);    
               });
            });
        }else {
            Game.findOne( 'first', function(err, game) {
                console.log(game)
                res.send(game);
            })
        }  
    }

	api.create = function(req, res) {
        var data = req.body;

        Feature.find( {'_id': { $in: data.features} }, function(err, features) {
            
           
            data.features = features;
            var game = new Game(data);

            var total = 0;
            var feature,
            i = features.length;

            while(--i > -1) {
                feature = features[i];
                total += feature.price;
            }

            game.value = total;
        
            User.findOne({fbID: req.userID}, function(err, user) {                         
                if(user.cash >= total) {
                    user.games.push(game._id);
                    
                    game.data[0].fbID = req.userID;
                        game.save(function(err, model){
                            user.save(function(err, user) {
                              res.send(game);     
                            });
                        });
                    
                    
                }else {
                    console.log('HAck');
                    // SOME ONE is trying to hack
                }
            }); 
        });
	}

	api.update = function(req, res) {

	}

	api.del = function(req, res){

	}

	return api;
}






function getTokenForCode(code, AppID, AppSecret, callback){
    var https = require('https');
    var authURL = 'https://graph.facebook.com/oauth/access_token?';
    authURL += 'client_id=' + AppID;
    authURL += '&redirect_uri=';
    authURL += '&client_secret=' + AppSecret;
    authURL += '&code=' + code.replace('\'', '');
    https.get(authURL, function (response) {
      var buffer = '';
      response.on('data', function(chunk) {
        buffer += chunk
      });
      response.on('end', function() {
        callback(buffer);   
      });
    }); 
}

    


function parseSignedRequest(signed_request, secret) {
    var crypto = require('crypto');
    encoded_data = signed_request.split('.',2);
    // decode the data
    sig = encoded_data[0];
    json = base64url.decode(encoded_data[1]);
    data = JSON.parse(json); // ERROR Occurs Here!
    
    // check algorithm - not relevant to error
    if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
        console.error('Unknown algorithm. Expected HMAC-SHA256');
        return null;
    }
 
    // check sig - not relevant to error
    expected_sig = crypto.createHmac('sha256',secret).update(encoded_data[1]).digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace('=','');
    if (sig !== expected_sig) {
        console.error('Bad signed JSON Signature!');
        return null;
    }
 
    return data;
}