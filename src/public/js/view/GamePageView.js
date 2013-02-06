define(
		['backbone', 
		'view/GameEngine',
		'view/GameFeatureView',
		'view/GameScoreView',
		'model/GameData'], 
	
	function(	Backbone ,
				GameEngine,
				GameFeatureView,
				GameScoreView,
				GameData) {

	return Backbone.View.extend({
		
		id : 'game',

		events : {
			'click #wipe-btn':  'refresh',
			'click #wipe-btn':  'refresh'
		},

		refresh : function() {
			this.model.set('gameData', new GameData());
			this.engine.model = this.model.get('gameData');
			this.gameScoreView.model = this.model.get('gameData');
			this.render();
		},

		initialize: function() {
			//this.listenTo(this.model.get('gameData').get('sticks'), 'add',this.processRemainingSticks, this);
			this.engine = new GameEngine({model:this.model.get('gameData')});
			this.engine.on('feature_run_out', this.selectAvailableFeature, this);	
			this.gameScoreView = new GameScoreView({model:this.model.get('gameData')}); 		
			this.children = [];
		},

		selectAvailableFeature: function(feature) {
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

			
		},

		processRemainingSticks: function() {
			//if(this.rods.get('amount') == 0) this.gameHasEnded();
			//this.rods.set({amount: this.rods.get('amount') - 1})
		},

		gameHasEnded : function() {
			//alert('ENDED');
		},

		render: function() {
			this.engine.stop();
			_.each(this.children, function(item) {
				item.remove();
				item.release();
			}, this);
			this.children.length = 0;
						this.$el.empty().append(this.engine.render().el);
			this.$el.append('<ol id="features" class="span1"></ol>');
			this.$el.append('<div class="btn-group"><button id="wipe-btn" class="btn">Wipe</button><button id="save-btn" class="btn">Save</button></div>')
			this.$el.append(this.gameScoreView.render().el);
			
			
			if(true) {

				this.first = true;
				this.model.get('game').get('features').each(function(feature) {
				//console.log('Feature:' , feature)
				feature.set('used', 0);
				feature.set('remaining', feature.get('amount') );
				var view = new GameFeatureView({model:feature});
				view.on('clicked', this.itemClicked, this);
				this.$el.find('#features').append(view.render().el);
				this.children.push(view);
			}, this);
			}
			//this.children.reverse();
			
			_.each(this.children, function(item) {
					
					item.setSelected(false);
					item.enable();

	
				
			}, this);

			this.selectAvailableFeature();
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
		}
	});
});