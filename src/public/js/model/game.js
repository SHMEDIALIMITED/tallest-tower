define(['backbone', 
		'easel', 
		'underscore'
		], function(Backbone, E, _) {
	return Backbone.Model.extend({

		url: '/api/games',



		parse : function(response) {
			return response;
		}
	});
});