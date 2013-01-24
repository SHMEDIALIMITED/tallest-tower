define(
	
	['backbone',
	'text!templates/me.html'], 

	function(	Backbone,
				template) {
	
	return Backbone.View.extend({

		el: '#cash',

		events :{
			'click' : 'onClick'
		},

		onClick: function() {
			this.model.set({cash:7});
		},

		initialize : function(options) {
			this.listenTo(this.model, "change", this.render);
		},

		render : function() {
			console.log('ME:', this.model.toJSON());
			
			this.$el.html(_.template(template, this.model.toJSON()));
		}
	});
});