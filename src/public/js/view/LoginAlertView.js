define(
	
	['backbone',
	'text!templates/login-alert.html'], 

	function(	Backbone,
				template) {
	
	return Backbone.View.extend({

		tagName: 'div',

		events :{
			'click' : 'onClick'
		},

		onClick: function() {
			
		},

		initialize : function(options) {
			//this.listenTo(this.model, "change:cash", this.render);
		},

		render : function() {
			this.$el.append(_.template(template));
		}
	});
});