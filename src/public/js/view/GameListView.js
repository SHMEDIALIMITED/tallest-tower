define(['backbone',
		'view/game_list_item'], 

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

			var child = this.children.pop();
			while(child) {
				//child.release();
				child = this.childern.pop();	
			}
			
			var itemView;
			
			this.collection.each(function(item){
				itemView = new GameListItemView({model:item});
				itemView.on('clicked', function(model) {
					console.log(model)
				});
				this.$el.append(itemView.render().el);
			}, this); 
			return this;
		}
	});
});