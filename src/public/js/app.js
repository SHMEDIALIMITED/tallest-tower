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
	'model/GameData',
	'view/MenuView'
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
				GameData,
				MenuView) {


	return Backbone.View.extend({
		
		el : '#app',

		events : {
			'click #facebook-btn'	: 'login'
		},
		
		login: function(e) { 
			e.preventDefault();
			FB.login(this.loginResponse)
		},

		loginResponse: function(response) {	
			this.model.save(null, {success:function(err, user) {
				console.log('LOGIN: SAVED USER'); 	
			}});
		},


		initialize: function() {
			_.bindAll(this);

			// Routing
			this.router = new Router();
			this.router.on('route:init', this.enterInit);
			this.router.on('route:lobby', this.enterLobby);
			this.router.on('route:create', this.enterCreate);
			this.router.on('route:preview', this.enterPreview);
			////////////////////////////////////////////////////
			
			// Models
			this.lobbyPage = new Backbone.Model({
	    		games : new GameCollection()
	    	});

			// Permanent Views
			this.menu = new MenuView({model:this.router});


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
				user : this.model
			});
			features.fetch();
	    	this.currentView = new CreateView({model:createPageModel});
			this.currentView.render();
			this.$el.find('#main').empty().append(this.currentView.el);
		},

		enterLobby : function() {
	    	this.lobbyPage.get('games').fetch(); 
	    	if(this.currentView) this.currentView.release();
			this.currentView = new Lobby({model:this.lobbyPage});
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
			setTimeout(_.bind(this.router.navigate), 1000, 'lobby', true);
		}
	});
})