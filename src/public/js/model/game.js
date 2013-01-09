define(['backbone', 'model/points', 'model/sticks'], function(Backbone, Points, Sticks) {

	return Backbone.Model.extend({
		url : '/api/games',

		parse : function(response) {
			response.points = new Points(response.points);
			response.sticks = new Sticks(response.sticks);
            return response;
		}
	});
})