define(['backbone', 
		'easel', 
		'underscore',
		'model/game-list-item'], function(Backbone, E, _, GameData) {
	return Backbone.Collection.extend({

		url: '/gamedata',

		model : GameData, 

		initialize : function() {
			 
		},
	});
});