define(['backbone', 'model/points', 'model/sticks'], function(Backbone, Points, Sticks) {

	return Backbone.Model.extend({
		url : '/api/games',

		parse : function(response) {
			//console.log('RESPINSE',response)
			response.points = new Points(response.points);
			response.sticks = new Sticks(response.sticks);
            return response;
		},

		toJSON: function() {
			var j = JSON.stringify(this.attributes);
			console.log(j) 
			return j
		}
	});
})