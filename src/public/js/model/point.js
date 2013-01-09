define(['backbone'], function(Backbone) {
	return Backbone.Model.extend({
		defaults: {
			fixed:false,
			ready : false
		},

		initialize: function() {
			
		},

		reset: function() {
			
			console.log('reset', this.previousAttributes.x);
		},

		update : function(){

			 var x = this.get('x');
	       	 var y = this.get('y');

	       	 this.set({x: x + x - this.previous('x')});
	         this.set({y: y + y - this.previous('y')});
		}

	});
});