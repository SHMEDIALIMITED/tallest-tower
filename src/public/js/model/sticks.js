define(['backbone', 'model/stick'], function(Backbone, Stick) {
	return Backbone.Collection.extend({
		model : Stick
	});	
}) 