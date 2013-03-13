define(
		['backbone', 
		'view/GameEngine',
		'view/GameFeatureView',
		'view/GameScoreView',
		'model/GameData',
		'SignalMap',
		'view/CountDownView'], 
	
	function(	Backbone ,
				GameEngine,
				GameFeatureView,
				GameScoreView,
				GameData,
				SignalMap,
				CountDownView) {

	return Backbone.View.extend({
		
		id : 'game',

		events : {
			'click #refresh-btn':  'onRefresh',
			'click #save-btn':  'save',
			'click #back-btn':  'onBack'
		},

		save : function( ){
			
			//SignalMap.saveGameData.dispatch(this.model)
		},

		onRefresh : function() {
			//this.model.set('gameData', new GameData());
			this.model.get('gameData').dirty = true;
			SignalMap.showPopup.dispatch('confirm', false, this);
			
		},

		onBack : function() {
			SignalMap.navigate.dispatch('lobby');
		},

		refresh : function() {
			this.model.get('gameData').resetToDefaults();
			this.engine.model = this.model.get('gameData');
			this.gameScoreView.model = this.model.get('gameData');
			this.render();
			this.engine.start();
		},

		initialize: function(options) {

			console.log('Game Page ::::: init');

			//this.listenTo(this.model.get('gameData').get('sticks'), 'add',this.processRemainingSticks, this);
			this.engine = new GameEngine({model: this.model.get('gameData')});
			this.engine.on('feature_run_out', this.selectAvailableFeature, this);	
			this.gameScoreView = new GameScoreView({model:this.model.get('gameData')}); 
			this.countdown = new CountDownView({});		
			this.children = [];
		},

		selectAvailableFeature: function(feature, init) {
			_.each(this.children, function(item) {
				if(item.model == feature) {
					item.setSelected(false);
					item.disable();
					
					//return false;
				}
			}, this);

			var i = 0;
			_.every(this.children, function(item) {
				
				if(item.model.get('used') < item.model.get('amount') && item.getEnabled())  {
					this.engine.setFeature(item.model);
					item.setSelected(true);
					
					return false;
				}
				return true
			}, this);

			if(!init && this.engine.feature == feature) {
				alert('Game Finished');
			}	
		},

		processRemainingSticks: function() {
			//if(this.rods.get('amount') == 0) this.gameHasEnded();
			//this.rods.set({amount: this.rods.get('amount') - 1})
		},

		gameHasEnded : function() {
			//alert('ENDED');
		},

		render: function() {

			//console.log('GamePage Render', this.model.get('gameData').get('features').toJSON() )

			this.engine.stop();
			_.each(this.children, function(item) {
				item.remove();
				item.release();
			}, this);
			this.children.length = 0;
			this.$el.empty().append(this.engine.render().el);
			this.$el.append('<ol id="features" class="span1"></ol>');
			this.$el.append('<div class="btn-group"><button id="back-btn" class="btn"><i class="back-btn"></i>Back</button><button id="refresh-btn" class="btn"><i class="refresh-btn"></i>Refresh</button></div>')
			this.$el.append(this.gameScoreView.render().el);
			this.$el.append(this.countdown.render().el);
			
			//this.$el.append('<div style="position:absolute; z-index:100; top:0px;"><img src="http://graph.facebook.com/' + this.model.get('game').get('fbID') + '/picture?width=15&height=15" /></div>');
			
			if(this.model.get('gameData').get('features').length == 0) {
				
				var features = [];
				this.model.get('game').get('features').each(function(feature){
					var gameFeature = new Backbone.Model(feature.toJSON());
					features.push(gameFeature);
				});


				this.model.get('gameData').set('features', new Backbone.Collection(features));;
			} else {
				
			}

			
			
			if(true) {

				this.first = true;
				this.model.get('gameData').get('features').each(function(feature) {
				//console.log('Feature:' , feature)
					
					feature.set('remaining', feature.get('amount') - feature.get('used') );
					var view = new GameFeatureView({model:feature});
					//console.log('GameFeature', feature.toJSON())
					view.on('clicked', this.itemClicked, this);
					this.$el.find('#features').append(view.render().el);
					this.children.push(view);
				}, this);
			}
			//this.children.reverse();
			//console.log('GamePage Render 4', this.model.get('gameData').get('features').first().toJSON() )
			_.each(this.children, function(item) {
					item.setSelected(false);
					if(item.model.get('remaining') > 0) item.enable();
					else item.disable();
			}, this);

			this.selectAvailableFeature(null, true);
			$('body').keydown(_.bind(function (e) {
				if(e.keyCode == 87) this.engine.up();
				else if(e.keyCode == 83) this.engine.down();
			}, this));
			return this;
		},

		itemClicked : function(model) {
			_.each(this.children, function(item) {
				if(item.model === model) {
					this.engine.setFeature(model);
					item.setSelected(true);
				} else { 
					item.setSelected(false);
				}
			}, this);
		},

		release : function() {
			
			this.model = null;
			this.engine.off('feature_run_out');	
			this.gameScoreView.release();
			this.engine.stop();
			this.engine.release();
			this.engine = null;
			this.gameScoreView = null;

			
			_.each(this.children, function(item) {
				item.remove();
				item.release();
			}, this);
			this.children.length = 0;
			this.children = null;

		}
	});
});