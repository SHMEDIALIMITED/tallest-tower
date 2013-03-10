define(['backbone', 'model/Point'], function(Backbone, Point) {
	return Backbone.Collection.extend({
		model : Point
	});	
}) 