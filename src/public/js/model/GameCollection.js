define(

	['backbone',
	'model/Game'], 

	function(Backbone,
			Game) {
	
	return Backbone.Collection.extend({
		url: '/api/games',

		model : Game,
	});
});