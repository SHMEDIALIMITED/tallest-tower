define(['backbone', 
		'easel', 
		'underscore',
		'text!templates/lobby.html'], function(Backbone, E, _, lobbyTemplate) {
	return Backbone.View.extend({

		id: 'lobby',



		initialize : function() {
			//this.model.on('change', this.render);
		},

		render : function() {
			var t = _.template(lobbyTemplate);
			this.$el.append(t);
		}
	});
});