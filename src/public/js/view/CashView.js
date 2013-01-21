define(
	
	['backbone'], 

	function(Backbone) {
	
	return Backbone.View.extend({

		el: '#cash',

		events :{
			'click' : 'onClick'
		},

		onClick: function() {
			this.model.set({cash:7});
		},

		initialize : function(options) {
			this.listenTo(this.model, "change:cash", this.render);
		},

		render : function() {
			this.$el.html('$ ' + this.model.attributes.cash);
		}
	});
});