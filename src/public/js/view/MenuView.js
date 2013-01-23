define(
	
	['backbone'], 

	function(Backbone) {
	
	return Backbone.View.extend({

		el: '#menu',

		events : { 
			'click #lobby-btn' : 'navigate',
			'click #create-btn' : 'navigate',
		},

		navigate : function(e) {
			e.preventDefault();
			var id = e.currentTarget.id;
			id = id.substr(0,id.indexOf('-'));
			this.model.navigate(id, true); 
		},

		initialize : function() {
			this.model.bind('all', this.render, this);
		},

		render : function(route) {	
			console.log('MenuView::render', route);
			route = route.replace('route:', '');
			var el = $('#' + route + '-btn');
			this.$el.find('li.active').removeClass('active');
			el.addClass('active');
			return this;
		}
	});
});