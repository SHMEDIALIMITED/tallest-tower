define([ 
	'router',
	'backbone',
	'game-engine',
	'model/game',
	'facebook',
	'jquery'
	], function(Router, Backbone, GameEngine, Game, FB, $) {

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

			


			router = new Router();
			Backbone.history.start();
			
			var gameModel = new Game();
			engine = new GameEngine({model:gameModel});
			


			gameModel.fetch({success:function(model) {
				console.log('MAIN' , model)
				engine.start();		
			}});

			setTimeout(function() {
				return;
				console.log('OOOOOOOO', gameModel.toJSON())
				gameModel.save({success:function(model){
					console.log('Saved', model)
				}});
				
			},4000)
			
		}
	}
})