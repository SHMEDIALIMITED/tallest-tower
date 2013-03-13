define(['backbone'], 

function(Backbone) {
	
	return Backbone.Model.extend({
		
		urlRoot : '/api/users/',

		idAttribute: '_id',

		defaults : {
			games : new Backbone.Collection(),
		},

	
	});
})