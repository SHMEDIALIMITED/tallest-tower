define(['backbone', 
		'model/points', 
		'model/point', 
		'model/sticks'], 

function(Backbone, Points, Point, Sticks) {

	return Backbone.Model.extend({
		url : '/api/users',


		defaults : {
			games : new Backbone.Collection(),
			cash : 5
		},

		parse : function(response) {

			//console.log(response)
			//response.games = this.get('games').reset(response.games);
			return response;
		},

		toJSON: function() {
			var json = _.clone(this.attributes);
			//json.games = this.get('games').toJSON();
			
			return json;
		}
	});
})