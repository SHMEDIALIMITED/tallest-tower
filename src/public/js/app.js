define([ 
	'router',
	'backbone',
	'game-engine'
	], function(Router, Backbone, GameEngine) {

	var router;
	var engine;
	return {
		init: function() {
			router = new Router();
			Backbone.history.start();

			engine = new GameEngine();
		}
	}
})