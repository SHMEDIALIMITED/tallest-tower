define(['backbone'], function(Backbone) {
	return Backbone.Model.extend({
		defaults: {
			a: null,
			b: null,
			length : 100,
			_diff: 0,
			fixed:false
		},

		initialize: function() {
			return;
			var dx = this.get('a').get('x') - this.get('b').get('x');
      		var dy = this.get('a').get('y') - this.get('b').get('y');
			this.set('length', Math.sqrt(dx * dx + dy * dy));
		},

		update : function(){
			var a = this.get('a');
			var b = this.get('b');
			var dx = b.get('x'); - a.get('x');
          	var dy = b.get('y'); - a.get('y');
          	var dist = Math.sqrt(dx * dx + dy * dy);
          
          	var diff = this.get('length') - dist;
          	if(diff > 20) {};
          	
          	var offsetX = (diff * dx / dist) / 2;
          	var offsetY = (diff * dy / dist) / 2;
	  	
	  		a.set({x:a.get('x') - offsetX});
	  		a.set({y:a.get('y') - offsetY});

	  		b.set({y:b.get('x') + offsetX});
	  		b.set({y:b.get('y') + offsetY});
	  	
	
	        this._diff = diff;
		}

	});
});