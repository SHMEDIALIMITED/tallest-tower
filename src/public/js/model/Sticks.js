define(['backbone', 'model/Stick'], function(Backbone, Stick) {
	return Backbone.Collection.extend({
		model : Stick,

		initialize : function() {
			this.bind('reset', function() {
				console.log('-------------------------- RESET');
			})
		}
	});	
}) 