define([ 
	'router',
	'backbone',
	'game-engine',
	'model/user',
	'facebook',
	'jquery',
	'state-machine',
	'view/lobby',
	'model/game-list',
	'view/game-list',
	'view/create'
	], function(Router, 
				Backbone, 
				GameEngine, 
				User, 
				FB, 
				$, 
				StateMachine, 
				Lobby, 
				GameList,
				GameListView,
				CreateView) {

	var router;
	var engine;
	var fsm;

	return {
		init: function() {

			fsm = StateMachine.create({
				events : [ 
					{ name: 'Init', from: 'none', to:'lobby' },
					{ name: 'Home', from: ['game', 'browse'], to:'lobby' },
					{ name: 'LoadGame', from: ['lobby', 'browse', 'play', 'create'], to:'game' },
					{ name: 'PlayGame', from: 'game', to:'play' },
					{ name: 'CreateGame', from: 'game', to:'create' },
				],
				callbacks: {

				    onInit: function() { 
				    	
				    	$('#lobby').show(); 
				    },
				    onHome: function() {
				    	$('#game-engine').hide(); 
				    	$('#lobby').show(); 
				    },
				    onLoadGame: function() { 
				    	$('#game').show(); 
				    },
				    onPlayGame: function() { 
				    	$('#engine').show(); 
				    },
				    onCreateGame: function() {
				    	$('#create').show();
				    }

  				}
			});

			$('#game-engine').hide();
				
			var create = new CreateView();
			create.render();
			$('.container-fluid').append(create.el);

			var gamelist = new GameList();
			var gameLististView = new GameListView({collection:gamelist})

			//gamelist.fetch(); 

			var lobby = new Lobby();
			lobby.render();
			//$('.container-fluid').append(lobby.el)
			
			$(window).resize(function() {
				$('.container-fluid').height( window.innerHeight - 50 )
			})



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

			
			//fsm.Init();

			
			
			

			
		}
	}
})