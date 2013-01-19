define('CreateView',
	
	['backbone',  
	'underscore',
	'text!templates/create.html'], 

	function(Backbone, _, template) {
	
	return Backbone.View.extend({

		id: 'create',

		

		initialize : function() {
			//this.model.on('change', this.render);
		},

		render : function() {
			var t = _.template(template);
			this.$el.append(t);
		}
	});
});