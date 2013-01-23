define(['backbone', 
		'text!templates/lobby.html',
		'view/GameListView'], 

		function(	Backbone, 
					template, 
					GameListView) {

	return Backbone.View.extend({

		id: 'lobby',

		initialize : function() {
			this.gameListView = new GameListView({collection: this.model.get('games')});
			this.findGameListView = new GameListView({collection: this.model.get('finds')});
		},
		
		render : function() {
			var t = _.template(template);
			this.$el.empty().append(t);
			this.$el.find('.span7').append(this.gameListView.el);
			this.$el.find('.span5').append(this.findGameListView.el);

		},

		release: function() {
			this.gameListView.release();
			this.gameListView = null;
			this.model = null;
		}
	});
});