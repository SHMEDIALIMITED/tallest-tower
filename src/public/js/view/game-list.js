define(['backbone', 
		'easel', 
		'underscore',
		'text!templates/game-list-item.html'], function(Backbone, E, _, template) {
	return Backbone.View.extend({

		className: 'game-list',

		initialize : function() {
			 _.bindAll(this, "render");
			this.collection.bind("reset", this.render);
		},

		render : function() {
			var t = _.template(template);
			this.$el.empty().append(t);
		}
	});
});