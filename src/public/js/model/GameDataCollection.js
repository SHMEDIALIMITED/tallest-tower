define( 

		['backbone',
		'model/GameData'], 

	function(Backbone, GameData) {

		return Backbone.Collection.extend({
			model: GameData
		});

});