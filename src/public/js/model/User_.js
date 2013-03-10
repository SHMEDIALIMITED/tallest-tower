define(['backbone'], 

function(Backbone) {

	return Backbone.Model.extend({
		url : '/api/users',


		defaults : {
			games : new Backbone.Collection(),
			cash : 100
		},

		save : function(attrs, options) {
	        Backbone.Model.prototype.save.call(this, attrs, options);
	    }
	});
})