define([ 
	'router',
	'backbone',
	'game-engine',
	'model/game'
	], function(Router, Backbone, GameEngine, Game) {

	var router;
	var engine;
	return {
		init: function() {
			router = new Router();
			Backbone.history.start();
			
			var gameModel = new Game();
			engine = new GameEngine({model:gameModel});
			
			gameModel.fetch({success:function(model) {
				
				engine.start();		
			}});
			
		}
	}
})