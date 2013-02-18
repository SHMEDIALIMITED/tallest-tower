	
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
	'view/MeView',
	'model/GameData',
	'view/MenuView',
	'view/AbstractView',
	'model/FindGameCollection',
	'SignalMap',
	'view/Popup'
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
				MeView,
				GameData,
				MenuView,
				AbstractView,
				FindGameCollection,
				SignalMap,
				Popup) {


	return Backbone.View.extend({
		
		el : '#app',

		events : {
			'click .login-btn'	: 'login',
			'click #logout-btn'	: 'logout'
		},
		
		login: function(e) { 
			console.log('doLogin')
			e.preventDefault();
			FB.login(this.loginResponse)
		},

		logout: function(e){
		
			FB.logout(function(response) {
				this.model.unset('facebook')
				$.cookie('fbsr_490996157610487', null);	
				this.enterLobby();
			});
			
			//this.router.navigate('/lobby', true);
		},

		loginResponse: function(response) {	
			console.log(response)
			var that = this;
			FB.api('/me', function(me) {
				console.log('Me', me);
				that.model.set({facebook:me});

				that.model.save({success:function(err, user) {
					console.log('User saved', user);
					
				}});
			});
		},

		

		initialize: function() {
			_.bindAll(this);
			
			// Routing
			this.router = new Router();
			this.router.on('route:init', this.enterInit);
			this.router.on('route:lobby', this.enterLobby);
			this.router.on('route:create', this.enterCreate);
			this.router.on('route:preview', this.enterPreview);
			this.router.on('route:play', this.enterGame);
			////////////////////////////////////////////////////
			
			// Signals
			SignalMap.gameSelected.add(function(vo) {
				console.log('Game Selected Command',vo.get('data').first().get('features').toJSON())
				this.currentGame = vo;
				this.router.navigate('/play', true);
			}, this);


			SignalMap.showPopup.add(function() {	
				this.$el.append(this.popup.render().el);
			}, this);


			SignalMap.popupAction.add(function(e) {
				this.popup.remove();
				FB.login(this.loginResponse)
			}, this);

			SignalMap.saveGame.add(function(game) {
				this.model.save();
				game.save({}, {success: function(err, game) {
							console.log('GAME SAVED: ', game);
						}, error: function(model, xhr, options){
							SignalMap.showPopup.dispatch();
						}});
				
			
			}, this);
			////////////////////////////////////////////////////


			// Models
				// Lobby
				this.lobbyPage = new Backbone.Model({
		    		games : new GameCollection(),
		    		finds : new FindGameCollection()
		    	});

				//debugger;
		    	
		    	// Create
				this.createPage = new Backbone.Model({
					features : new FeatureCollection(),
					game : null,
					user : this.model
				});
				// Game
				this.gamePage = new Backbone.Model({
					game : null,
					gameData : null,
					user : this.model
				});

			// Permanent Views
			this.menuView = new MenuView({model:this.router});
			this.meView = new MeView({model:this.model});
			this.popup = new Popup({});
			


			var view1 = new AbstractView();
			view1.children.push('HEllo');

			var view2 = new AbstractView();

			$(window).resize(this.resize);
			this.resize();	

			Backbone.history.start();
		},

		resize : function() {
			$('.container-fluid').height( window.innerHeight - 72 )
		},

		enterLobby : function() {	

			//SignalMap.showPopup.dispatch();
			//return 	
			this.$el.find('header').addClass('show-header');	
			this.$el.find('header').removeClass('hide-header');
			this.$el.find('#main').css({'padding-left': '40px', 'padding-right': '40px'});
	    	var lobby = new Lobby({model:this.lobbyPage});
	    	this.lobbyPage.get('games').fetch();
	    	this.lobbyPage.get('finds').fetch();
	    	this.render(lobby);
	    	
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

		enterGame: function() {	
			this.$el.find('#main').css({'padding-left': '0px', 'padding-right': '0px'});
			var fbID = this.model.get('fbID');
			console.log(this.currentGame.get('data'));
			console.log(fbID);
			var gameData = this.currentGame.get('data').find(function(data) {
				console.log('Data', data)
				return data.get('fbID') == fbID;
			})

			if(!gameData) {
				gameData = new GameData({fbID: fbID});
				this.currentGame.get('data').add(gameData);
				console.log(this.model)
				this.model.get('games').push(fbID);
			}
			console.log('enter Game',gameData.toJSON())


			
			this.$el.find('header').addClass('hide-header');
			this.$el.find('header').removeClass('show-header');
			this.gamePage.set({game: this.currentGame, gameData: gameData})
	    	this.render(new GamePageView({model:this.gamePage}));
		},

		enterInit : function() {
			setTimeout(_.bind(this.router.navigate), 500, 'lobby', true);
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