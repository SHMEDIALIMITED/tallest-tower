var Models = require('../models');
var base64url = require('b64url');

module.exports = function(config) {

    var Feature = Models.Feature;

	var api = {};

	api.read = function(req,res) {
		Feature.find(function(err,features) {
            res.send(features);
        });  
    }

	api.create = function(req, res) {

       // var id = parseSignedRequest(req.cookies['fbsr_' + config.facebook.clientID], config.facebook.clientSecret).user_id;
        // TODO : CHECK IF ME 
        

    
        
        var feature = new Feature({
            price: req.query.price,
            image : req.query.url,
            type : req.query.type,
            factor : req.query.factor 
        });



        feature.save(function(err, feature){
            if(err) console.log(err)
            else {
                    console.log(feature)
                    res.send(feature);
                }
        });
	}

	api.update = function(req, res) {

	}

	api.del = function(req, res){

	}

	return api;
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