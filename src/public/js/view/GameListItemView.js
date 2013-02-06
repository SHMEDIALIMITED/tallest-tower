define(
	   ['backbone', 
		'SignalMap',
		'text!templates/game-list-item.html'], 

		function(Backbone, SignalMap, template) {

	return Backbone.View.extend({

		tagName: 'li',


		className: 'game-list-item row-fluid btn',

		events : {
			'click' : 'onClick'
		},

		onClick: function() {
			
			SignalMap.gameSelected.dispatch(this.model);
		},

		initialize : function() {
			 _.bindAll(this, "render");
		},

		release: function() {
			this.undelegateEvents();
			this.model = null;
		},

		render : function() {
			var data = this.model.toJSON();
			data.height = 1
			
			var t = _.template(template, data);
			this.$el.empty().append(t);
			return this;
		}
	});
});