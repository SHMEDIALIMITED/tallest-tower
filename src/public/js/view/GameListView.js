define(['backbone',
		'view/GameListItemView'], 

		function(	Backbone,
					GameListItemView) {
	
	return Backbone.View.extend({

		tagName: 'ul',

		id: 'game-list',

		className: 'game-list',


		initialize : function() {
			
			console.log('GAMELIST:: init', this.el)
			 _.bindAll(this, "render"); 
			this.collection.bind("reset", this.render);
			this.children = [];
		},

		render : function() {

			_.each(this.childern, function(child) {
				child.release();
			});
			
			var itemView;
			
			this.collection.each(function(item){
				itemView = new GameListItemView({model:item});
				itemView.on('clicked', function(model) {
					console.log(model)
				});
				this.$el.append(itemView.render().el);
			}, this); 
			return this;
		},

		release : function() {
			this.collection.unbind("reset", this.render);
			this.collection = null;
			_.each(this.childern, function(child) {
				child.release();
			});
			this.children.length = 0;
			this.children = null;
		}
	});
});