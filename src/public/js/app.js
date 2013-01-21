define([ 
	'router',
	'backbone',
	'game-engine',
	'model/user',
	'facebook',
	'jquery',
	'state-machine',
	'view/lobby',
	'model/GameCollection',
	'view/GameListView',
	'view/CreateView',
	'model/FeatureCollection',
	'view/FeatureListView',
	'model/Game',
	'view/CashView',
	'model/GameData'
	], function(Router, 
				Backbone, 
				GameEngine, 
				User, 
				FB, 
				$, 
				StateMachine, 
				Lobby, 
				GameCollection,
				GameListView,
				CreateView,
				FeatureCollection,
				FeatureListView,
				Game,
				CashView,
				GameData) {


	return Backbone.View.extend({
		
		el : '#app',

		events : {
			'click #create-btn' : 'create',
			'click #lobby-btn'	: 'lobby',
			'click #login-facebook-btn'	: 'login',
		},


		//
		// TODO : MOVE NAV CODE TO MENUVIEW :)
		//  
		//    
		create : function(e) { 
			e.preventDefault();
			console.log('HERE', router);
			router.navigate('create', true); 

		},
		lobby : function() { this.e },
		login: function() { console.log('HERE'); FB.login(function(response) {
			this.model.save(null, {success:function(err, user) {
				
			}})
		})},


		initialize: function() {
			_.bindAll(this);

			// Routing
			this.router = new Router();
			this.router.on('route:init', this.enterInit);
			this.router.on('route:lobby', this.enterLobby);
			this.router.on('route:create', this.enterCreate);
			this.router.on('route:preview', this.enterPreview);
			////////////////////////////////////////////////////
		
			$(window).resize(this.resize);
			this.resize();	

			Backbone.history.start();
		},

		resize : function() {
			$('.container-fluid').height( window.innerHeight - 50 )
		},

		enterCreate : function() {
			var newGame = new Game();
	    	var features = new FeatureCollection();
			var createPageModel = new Backbone.Model({
				features : features,
				game : newGame,
				user : self.model
			});
			features.fetch();
	    	this.currentView = new Lobby({model:lobbyPageModel});
			this.currentView.render();
			this.$el.find('#main').empty().append(this.currentView.el);
		},

		enterLobby : function() {
	    	var games = new GameCollection();
	    	var lobbyPageModel = new Backbone.Model({
	    		games : games
	    	});
	    	games.fetch(); 
			this.currentView = new Lobby({model:lobbyPageModel});
			this.currentView.render();
			this.$el.find('#main').empty().append(this.currentView.el);
		},

		enterPreview: function() {
			var gameData = new GameData({
	    		url : '/api/data/'
	    	});
			gameData.fetch();	
	    	this.currentView = new GameEngine({model:gameData});
			this.currentView.render();
			this.$el.find('#main').empty();
			this.$el.append(this.currentView.el);;
		},

		enterInit : function() {
			this.router.navigate('lobby', true);
		}
	});
})