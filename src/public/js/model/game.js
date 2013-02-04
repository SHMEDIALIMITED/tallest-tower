define(['backbone', 
		'model/GameDataCollection'

		], function(Backbone,
					GameDataCollection) {

			
			var that;
	return Backbone.Model.extend({

		url: '/api/games',


		parse : function(response) {
			response.data = new GameDataCollection(response.data, {parse:true});
			response.features = new Backbone.Collection(response.features, {parse:true});
			return response;
		},

		toJSON : function() {
			var json = _.clone(this.attributes);
			console.log('Game::toJSON', this);
			json.data = this.get('data').toJSON();
			if(!json.features instanceof Array) json.features = this.get('features').toJSON();
			return json;
		}
	});
});