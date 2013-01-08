define([ 
	'router',
	'backbone'
	], function(Router, Backbone) {

	var router;

	return {
		init: function() {
			router = new Router();
			Backbone.history.start();
		}
	}
})