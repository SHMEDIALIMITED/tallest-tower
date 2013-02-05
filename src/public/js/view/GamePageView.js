define(
		['backbone', 
		'view/GameEngine',
		'view/GameFeatureView'], 
	
	function(	Backbone ,
				GameEngine,
				GameFeatureView) {

	return Backbone.View.extend({
		
		id : 'game',

		events : {
			'click #wipe-btn':  'render'
		},

		refresh : function() {
			this.engine.render();
		},

		initialize: function() {
			//this.listenTo(this.model.get('gameData').get('sticks'), 'add',this.processRemainingSticks, this);
			this.engine = new GameEngine({model:this.model.get('gameData')});
			this.engine.on('feature_run_out', this.selectAvailableFeature, this);			
			this.children = [];
		},

		selectAvailableFeature: function(feature) {
			_.each(this.children, function(item) {
				if(item.model == feature) {
					item.setSelected(false);
					item.disable();
					console.log('HERE', item)
					//return false;
				}
			}, this);

			var i = 0;
			_.every(this.children, function(item) {
				console.log('HELLLO ', item.getEnabled())
				if(item.model.get('amount') > 0 && item.getEnabled())  {
					this.engine.setFeature(item.model);
					item.setSelected(true);
					console.log(++i)
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
			_.each(this.children, function(item) {
				item.release();
			}, this);
			this.children.length = 0;
			this.$el.empty().append(this.engine.render().el);
			this.$el.append('<button id="wipe-btn">Wipe</button><ul id="features" class="span1"></ul>')
			
			
			
			this.model.get('game').get('features').each(function(feature) {

				var view = new GameFeatureView({model:feature});
				view.on('clicked', this.itemClicked, this);
				this.$el.find('#features').append(view.render().el);
				this.children.push(view);
			}, this);
			
			//this.children.reverse();
			
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