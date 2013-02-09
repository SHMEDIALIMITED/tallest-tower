define(
	
	['backbone',
	'text!templates/me.html'], 

	function(	Backbone,
				template) {
	
	return Backbone.View.extend({

		el: '#me',

		

		onClick: function() {
			//this.model.set({cash:50});
		},

		initialize : function(options) {
			this.listenTo(this.model, "change", this.render);
			this.render();
		},

		render : function() {
			var data = this.model.toJSON();
			data.loggedIn = data.facebook ? true : false;
			this.$el.html(_.template(template, data));
			return this;
		}
	});
});