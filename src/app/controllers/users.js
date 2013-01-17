var game = { 
	id: 1,
	points: [{x:-100, y:0, fixed:true}, {x:100, y:0, fixed:true}],  
	sticks: [],
	score : {height:100, time:200},
	modified: new Date()  
};

var User = require('../models/user');
var base64url = require('b64url');

module.exports = function(config) {

	var api = {};

	api.read = function(req,res) {
		var id = parseSignedRequest(req.cookies['fbsr_' + config.facebook.clientID], config.facebook.clientSecret).user_id;
	    User.findOne({fbID: id}, function(err, user) {
            console.log('READ USER', user.sticks )
            res.send(user);
        });    
    }

	api.create = function(req, res) {

        

		var id = parseSignedRequest(req.cookies['fbsr_' + config.facebook.clientID], config.facebook.clientSecret).user_id;
		User.findOne({fbID: id},  function (err, user) {
			
            if(user) {
                console.log(user)
				res.send(user);
			}else {
				console.log('CRATED NEW USER');
                
                var data = req.body;

                data.fbID = id;
                //console.log('BODY', JSON.stringify(data));
                user = new User(data);
        
                //console.log('DB MODEL', user.sticks);
                user.save(function(err, user) {
                    console.log('SAVED', user)
                    res.send(user);
                });
			}
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