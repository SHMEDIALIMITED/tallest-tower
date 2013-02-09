define(
		['backbone',
		'model/Game'], 

		function(Backbone, Game) {

		return Backbone.Collection.extend({

			model: Game,

			url : '/api/games?find=true'
		});
});