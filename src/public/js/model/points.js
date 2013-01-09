define(['backbone', 'model/point'], function(Backbone, Point) {
	return Backbone.Collection.extend({
		model : Point
	});	
}) 