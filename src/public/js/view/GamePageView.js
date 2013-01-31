define(
		['backbone', 
		'view/GameEngine',
		'view/GameFeatureView'], 
	
	function(	Backbone ,
				GameEngine,
				GameFeatureView) {

	return Backbone.View.extend({
		
		id : 'game',

		initialize: function() {
			//this.listenTo(this.model.get('gameData').get('sticks'), 'add',this.processRemainingSticks, this);

			this.engine = new GameEngine({model:this.model.get('gameData')});
			
			this.children = [];
		},

		processRemainingSticks: function() {
			//if(this.rods.get('amount') == 0) this.gameHasEnded();
			//this.rods.set({amount: this.rods.get('amount') - 1})
		},

		gameHasEnded : function() {
			alert('ENDED');
		},

		render: function() {
			_.each(this.children, function(item) {
				item.release();
			}, this);
			this.children.length = 0;
			this.$el.empty().append(this.engine.render().el);
			this.$el.append('<ul id="features"></ul>')
			this.totalFixed = 0;
			this.totalRod = 0;
			this.model.get('game').get('features').forEach(function(feature) {

				switch(feature.get('type')) {
					case 'Fixed Bolt' :
						this.totalFixed += (feature.get('factor') * 1)
					break;

					case 'Rod' :
						this.totalRod += (feature.get('factor') * 1)
					break;
				}

				
			}, this);

			if(this.totalFixed != 0) {
				this.fixed = new Backbone.Model({
					amount : this.totalFixed,
					type : 'Fixed Bolt',
					image : 'img/bolt.png'
				})

				var view = new GameFeatureView({model:this.fixed});
				view.on('clicked', this.itemClicked, this);
				this.$el.find('#features').append(view.render().el);
				this.children.push(view);
			} 

			if(this.totalRod != 0) {
				this.rods = new Backbone.Model({
					amount : this.totalRod,
					type: 'Rod',
					image : 'img/rod_small.png'
				});
				var view = new GameFeatureView({model:this.rods});
				view.on('clicked', this.itemClicked, this);
				this.$el.find('#features').append(view.render().el);
				this.children.push(view);
			}


			console.log('TOTOAL', this.totalFixed, this.totalRod)
			return this;
		},

		itemClicked : function(model) {
			_.each(this.children, function(item) {

				console.log(item.model === model)
				if(item.model === model) item.setSelected(true);
				else item.setSelected(false);
			}, this);
		},

		release : function() {
			this.model = null;
		}
	});
});