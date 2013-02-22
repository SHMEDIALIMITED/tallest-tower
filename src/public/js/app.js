	
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
	'view/Popup',

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

		
		
		

		

		loginResponse: function(response) {	
			if(!response.authResponse) {
				SignalMap.popupAction.dispatch();
				return;
			}
			var that = this;
			FB.api('/me', function(me) {
				
				that.model.set({facebook:me});

				that.model.save({success:function(err, user) {
					console.log('User saved', user);
					SignalMap.popupAction.dispatch();
				}});
			});
		},

		

		initialize: function(options) {
			_.bindAll(this);
			var that = this;
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
				this.currentGame = vo;
				this.router.navigate('/play', true);
			}, this);


			SignalMap.showPopup.add(function(type, catious) {
				this.$el.on("touchmove", false);	
				this.$el.append(this.popup.render(type).show(catious).el);
			}, this);


			SignalMap.popupAction.add(function(e) {

				switch(e) {
					case 'lobby' : this.router.navigate('lobby', true); break;
					case '' : break;
					case '' : break;
				}

				this.popup.hide();
				this.$el.off("touchmove", false);	
				//FB.login(this.loginResponse)
			}, this);

			SignalMap.saveGame.add(function(game) {
				SignalMap.showPopup.dispatch('loading');
				this.model.save();
				game.save({}, {success: function(err, model) {
							console.log('GAME SAVED: ', game);

							model = game.toJSON();
							model.features = model.features.toJSON();


							that.popup.render('gameSuccess', model)
							//SignalMap.showPopup.dispatch('gameDataSuccess');
						}, error: function(model, xhr, options){
							console.log('GAME SAVED EROR: ', xhr);
							if(xhr.status == 403) {
								SignalMap.showPopup.dispatch('login', false);
							}
						}});
				
			
			}, this);

			SignalMap.saveGameData.add(function(gamePage) {
				SignalMap.showPopup.dispatch('loading');
				this.model.save();
				gamePage.get('game').save({}, {success: function(err, model) {
							console.log('GAME SAVED: ', game);

							model = gamePage.toJSON();
							model.game = model.game.toJSON();
							model.gameData = gamePage.get('gameData').toJSON();
							that.popup.render('gameDataSuccess', model)
							//SignalMap.showPopup.dispatch('gameDataSuccess');
						}, error: function(model, xhr, options){
							console.log('GAME SAVED EROR: ', xhr);
							if(xhr.status == 403) {
								SignalMap.showPopup.dispatch('login', false);
							}
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
			this.popup = new Popup({model:this.model});
			

			$(window).resize(this.resize);
			this.resize();	

			
			var that = this;
			this.$el.find('#preloader').fadeOut('fast', function() {
				setTimeout(function() {
					Backbone.history.start()
				}, 500);
			});
			

		},

		resize : function() {
			$('.container-fluid').height( window.innerHeight - 72 )
		},

		enterLobby : function() {	

			SignalMap.showPopup.dispatch('loading', true);
			//return 	
			this.$el.find('header').addClass('show-header');	
			this.$el.find('header').removeClass('hide-header');
			this.$el.find('#main').css({'padding-left': '40px', 'padding-right': '40px'});
	    	var lobby = new Lobby({model:this.lobbyPage});
	    	this.lobbyPage.get('games').fetch({success: function() {
	    		SignalMap.popupAction.dispatch();
	    	}});
	    	this.lobbyPage.get('finds').fetch();
	    	this.render(lobby);
	    	
		},

		enterCreate : function() {

			SignalMap.showPopup.dispatch('loading', true);
			this.createPage.set({game: new Game()})
			this.render(new CreatePageView({model:this.createPage}));
			this.createPage.get('features').fetch({success:_.bind(function() {
				SignalMap.popupAction.dispatch();
			}, this), error:function(model, xhr) {
				console.log('Feature fetch error', xhr);
			}});
			
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

	    	SignalMap.engineReady.addOnce(function(engine) {
	    		engine.start();
	    	}, this);
		},

		enterInit : function() {
			this.router.navigate('lobby', true);
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