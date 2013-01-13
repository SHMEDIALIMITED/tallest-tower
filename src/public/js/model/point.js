define(['backbone'], function(Backbone) {
	return Backbone.Model.extend({
		defaults: {
			fixed:false,
			ready : false,
			oldX : 0.0,
			oldY : 0.0,
			selected:false
		},

		initialize: function() {
			
	         this.set('oldX', this.get('x'));
	         this.set('oldY', this.get('y'));
		},

		reset: function() {
			
			console.log('reset', this.previousAttributes.x);
		},

		update : function(){

			 var x = this.get('x');
	       	 var y = this.get('y');

	       	 this.set({x: x + x - this.get('oldX')});
	         this.set({y: y + y - this.get('oldY')});

	         this.set('oldX', x);
	         this.set('oldY', y);
		},

		set: function(attributes, options) {
			if((attributes.x || attributes.y) && this.get('fixed')) return;
			Backbone.Model.prototype.set.apply(this, arguments);
		}

	});
});