	
	define([ 
	'router',
	'backbone',
	'view/GamePageView',
	'facebook',
	'jquery',
	'view/LobbyPage',
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
	'view/GameEngine',
	'midi'

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
				Popup,
				GameEngine) {




	return Backbone.View.extend({
		
		el : '#app',

		
		
		// TODO : Move login response method to FB namespace

		

		loginResponse: function(response) {	
			if(!response.authResponse) {
				SignalMap.popupAction.dispatch();
				return;
			}
			var that = this;
			FB.api('/me', function(me) {
				
				that.model.set({facebook:me});

				that.model.save({success:function(err, user) {
					
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
			// 
			
			SignalMap.engineReady.add(function(engine) {
				SignalMap.popupAction.dispatch();	
	    		engine.start();
	    	}, this);

			SignalMap.navigate.add(function(route)  {
				this.router.navigate(route, true);
			}, this);

			SignalMap.gameSelected.add(function(vo) {
				this.currentGame = vo;
				this.router.navigate('/play', true);
			}, this);


			SignalMap.showPopup.add(function(type, catious, action) {
				SignalMap.popupAction.action = action;
				this.$el.on("touchmove", false);	
				this.$el.append(this.popup.render(type).show(catious).el);
			}, this);


			SignalMap.popupAction.add(function(e) {

				switch(e) {
					case 'lobby' : this.router.navigate('lobby', true); break;
					case 'confirm' : SignalMap.popupAction.action.refresh(); break;
					case 'close' : this.router.navigate('lobby', true); break;
				}

				this.popup.hide();
				this.$el.off("touchmove", false);	
				//FB.login(this.loginResponse)
			}, this);

			SignalMap.saveGame.add(function(game) {
				SignalMap.showPopup.dispatch('loading');

				
				game.save({}, {success: function(err, model) {
							

							model = game.toJSON();
							model.features = model.features.toJSON();


							that.popup.render('gameSuccess', model)
							//SignalMap.showPopup.dispatch('gameDataSuccess');
						}, error: function(model, xhr, options){
							
							if(xhr.status == 403) {
								SignalMap.showPopup.dispatch('login', false);
							}
						}});
				
			
			}, this);

			SignalMap.saveGameData.add(function(gamePage, auto) {
				SignalMap.showPopup.dispatch('loading');
				//debugger;
				// this.model.save({cash:300}, {success: function() {
				// 	console.log('USER SAVE SUCCESS')
				// }});


				
				
				gamePage.get('game').save(null,  {success: function(err, model) {
							

							if(auto) {
								that.popup.render('loading');
								that.enterLobby();
							}else {
								model = gamePage.toJSON();
								model.game = model.game.toJSON();
								model.gameData = gamePage.get('gameData').toJSON();
								that.popup.render('gameDataSuccess', model)
							}

							
							//SignalMap.showPopup.dispatch('gameDataSuccess');
						}, error: function(model, xhr, options){
							
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

			// Engine
			 

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

			//this.gamePage.set({game: this.currentGame, gameData: gameData})
			//
			
			MIDI.loadPlugin({
		      soundfontUrl: "img/soundfont/",
		      instruments: ["acoustic_grand_piano"],
		      callback: function() {
		        var delay = 0; // play one note every quarter second
		        var note = 0x15; // the MIDI note
		        var velocity = 127; // how hard the note hits
		        // play the note
		      	
		        

				// // play the note
				// MIDI.setVolume(0, 127);
				// MIDI.noteOn(0, note, velocity, delay);
				// MIDI.noteOff(0, note, delay + 0.75);


				// var delay = 1; // play one note every quarter second
		  //       var note = 0x21; // the MIDI note
		  //       var velocity = 127; // how hard the note hits
				// MIDI.setVolume(0, 127);
				// MIDI.noteOn(0, note, velocity, delay);
				// MIDI.noteOff(0, note, delay + 0.75);

				
		       MIDI.Player.loadFile('img/midi/egypt.mid', MIDI.Player.start)
		      }
		    });
			
				
			if(this.gamePage.get('gameData') && this.gamePage.get('gameData').dirty) {
				this.model.save({},  {success: function(err, model) {
								
							console.log('KKK');
								
							}, error: function(model, xhr, options){
								console.log('ERROR');
								if(xhr.status == 403) {
									SignalMap.showPopup.dispatch('login', false);
								}
							}});

				SignalMap.saveGameData.dispatch(this.gamePage, true);
				
				
					
				
			
			
				this.gamePage.get('gameData').dirty = false;
				return;
			}else {
				SignalMap.showPopup.dispatch('loading', true);
			}

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
			SignalMap.showPopup.dispatch('loading', true);

			this.$el.find('#main').css({'padding-left': '0px', 'padding-right': '0px'});
			var fbID = this.model.get('fbID');
			
			var gameData = this.currentGame.get('data').find(function(data) {
				
				return data.get('fbID') == fbID;
			})

			if(!gameData) {
				gameData = new GameData({fbID: fbID});
				this.currentGame.get('data').add(gameData);
				
				this.model.get('games').push(fbID);
			}else {
				
			}
		
			
			this.$el.find('header').addClass('hide-header');
			this.$el.find('header').removeClass('show-header');
			
			this.gamePage.set({game: this.currentGame, gameData: gameData})
			


	    	this.render(new GamePageView({model:this.gamePage}));

	    	
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