define(['backbone'], function(Backbone) {
	return Backbone.Router.extend({
		routes : {
			'' : 'init',
			'create': 'create',
			'preview' : 'preview',
			'lobby' : 'lobby',
			'play' : 'play'
		}

	});
})