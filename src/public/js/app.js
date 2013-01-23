define([ 
	'router',
	'backbone',
	'view/GamePageView',
	'facebook',
	'jquery',
	'view/lobbyPage',
	'model/GameCollection',
	'view/CreatePageView',
	'model/FeatureCollection',
	'model/Game',
	'view/CashView',
	'model/GameData',
	'view/MenuView',
	'view/AbstractView',
	'model/FindGameCollection'
	], function(Router, 
				Backbone, 
				GamePageView, 
				FB, 
				$, 
				Lobby, 
				GameCollection,
				CreatePageView,
				FeatureCollection,
				Game,
				CashView,
				GameData,
				MenuView,
				AbstractView,
				FindGameCollection) {


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
				// Lobby
				this.lobbyPage = new Backbone.Model({
		    		games : new GameCollection(),
		    		finds : new FindGameCollection()
		    	});
		    	// Create
				this.createPage = new Backbone.Model({
					features : new FeatureCollection(),
					game : new Game(),
					user : this.model
				});

			// Permanent Views
			this.menu = new MenuView({model:this.router});
			this.cashView = new CashView({model:this.model});

			var view1 = new AbstractView();
			view1.children.push('HEllo');

			var view2 = new AbstractView();

			console.log(view1, view2);


			$(window).resize(this.resize);
			this.resize();	

			Backbone.history.start();
		},

		resize : function() {
			$('.container-fluid').height( window.innerHeight - 50 )
		},

		enterLobby : function() {
	    	this.lobbyPage.get('games').fetch(); 
	    	this.lobbyPage.get('finds').fetch(); 
			this.render(new Lobby({model:this.lobbyPage}));
		},

		enterCreate : function() {
			this.createPage.get('features').fetch();
			this.createPage.set({game: new Game()})
			this.render(new CreatePageView({model:this.createPage}));
		},

		enterPreview: function() {
			var gameData = new GameData({
	    		url : '/api/data/'
	    	});
			gameData.fetch();	
	    	this.render(new GameEngine({model:gameData}));
		},

		enterInit : function() {
			setTimeout(_.bind(this.router.navigate), 1000, 'lobby', true);
		},

		render: function(view) {
			if(this.currentView) this.currentView.release();
	    	this.currentView = view;
			this.currentView.render();
			this.$el.find('#main').empty().append(this.currentView.el);
			return this;
		}
	});
})