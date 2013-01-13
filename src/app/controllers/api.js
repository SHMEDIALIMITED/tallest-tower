
exports.getGames = function(req,res) {
	res.json(game);
}

exports.saveGame = function(req, res) {
	//game = JSON.parse(req.body);
	//game.points.push({x:100, y:-150, fixed:true});
	console.log(game)
}

exports.test =  function(req, res) {
    
    var signedRequest  = parse_signed_request(req.cookies.fbsr_490996157610487, process.env.FACEBOOK_APP_SECRET); 

    var https = require('https');

   // https://graph.facebook.com/oauth/access_token?client_id={0}&redirect_uri={1}&client_secret={2}&code={3}
    var authURL = 'https://graph.facebook.com/oauth/access_token?';
    authURL += 'client_id=490996157610487';
    authURL += '&redirect_uri=';
    authURL += '&client_secret=' + process.env.FACEBOOK_APP_SECRET;
    authURL += '&code=' + signedRequest.code.replace('\'', '');
    console.log('AUTH', authURL);
    

    https.get(authURL, function (response) {
      var buffer = '';
      response.on('data', function(chunk) {
        buffer += chunk
      });

       response.on('end', function() {
        console.log('AUTH', buffer);   
      });  

     
    
    }); 



    
  
 // console.log('SESSION', req.cookies);
})

function parse_signed_request(signed_request, secret) {
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