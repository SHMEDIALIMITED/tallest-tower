define([ 
	'router',
	'backbone',
	'game-engine',
	'model/user',
	'facebook',
	'jquery'
	], function(Router, Backbone, GameEngine, User, FB, $) {

	var router;
	var engine;
	return {
		init: function() {

			FB.init({
		      appId      : '490996157610487', // App ID
		      //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
		      status     : true, // check login status
		      cookie     : true, // enable cookies to allow the server to access the session
		    });

		     /* All the events registered */
            FB.Event.subscribe('auth.login', function (response) {
                // do something with response
                alert("login success");
            });
            FB.Event.subscribe('auth.logout', function (response) {
                // do something with response
                alert("logout success");
            });

            FB.getLoginStatus(function (response) {

            	if(response.status == 'connected') {
            		// USER HAS DATA
            		//createNewUser();
            	}else if(response.status == 'not_authorized') {
            		// USER LOGGED IN BUT NO DATA
            	}else {
            		// USER NOT LOGGED IN
            	} 
			
            });

			$('#loginButton').click(function() {
				FB.login(function(response) {
               		console.log('LOGIN: ', response);
				   if (response.authResponse) {
				     console.log('Welcome!  Fetching your information.... ');
				     FB.api('/me', function(response) {
				       console.log('Good to see you, ' + response.name + '.');
				     });
				   } else {
				     console.log('User cancelled login or did not fully authorize.');
				   }
			    });
			});

			$('#logoutButton').click(function() {
				FB.logout();
			});

			$('#createButton').click(function() {
				createNewUser();
			});

			$('#readButton').click(function() {
				user.fetch({success: function(model, response, options) {



					console.log('USER READ', model);

					engine.render();
				}});
			});



			function createNewUser() {
				
				user.save(null, {success: function(user) {
					console.log('USER CREATED', user);
				}});
			}


			router = new Router();
			Backbone.history.start();

			var user = new User();
				engine = new GameEngine({model:user});
				engine.render();

				
			
			

			
		}
	}
})