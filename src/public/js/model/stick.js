define(['backbone'], function(Backbone) {
	return Backbone.Model.extend({
		defaults: {
			a: null,
			b: null,
			x: 0,
			y: 0,
			rotation: 0, 
			length : 100,
			_diff: 0,
			fixed:false
		},

		points : null,

		initialize: function() {


			
			
			var dx = this.get('a').get('x') - this.get('b').get('x');
      		var dy = this.get('a').get('y') - this.get('b').get('y');
			this.set('length', Math.sqrt(dx * dx + dy * dy));

			console.log(this.get('length'))
		},

		update : function() {

			


			var a = this.get('a');
			var b = this.get('b');
			var dx = b.get('x') - a.get('x');
          	var dy = b.get('y') - a.get('y');
          	var dist = Math.sqrt(dx * dx + dy * dy);
          
          	var diff = this.get('length') - dist;
          	if(diff > 20) {};
          	
          	var offsetX = (diff * dx / dist) / 2;
          	var offsetY = (diff * dy / dist) / 2;
	  	
			a.set({x:a.get('x') - offsetX});
	  		a.set({y:a.get('y') - offsetY});

	  		b.set({x:b.get('x') + offsetX});
	  		b.set({y:b.get('y') + offsetY});
	  		
	  		this.set('x', (a.get('x') + b.get('x')) * 0.5);
	  		this.set('y', (a.get('y') + b.get('y')) * 0.5);
	      	this.set('rotation', (Math.atan2((b.get('x') -  a.get('x')) , (a.get('y') - b.get('y') ) )* 180 / Math.PI + 90));
	      
	
	        this._diff = diff;
		},
		parse : function(response) {
			
			//console.log('STICK RESPONSE:', response);

			// //console.log('STICK MODEL:', this);

			// //response.set({a: this.get('a').set(response.a)});
			// //response.set({b: this.get('b').set(response.b)});
			// console.log('STIVCK', response.a);
			// response.a = new Point(response.a);
			// response.b = this.get('b').set(response.b);

			
			return response;
		},

		toJSON : function() {
			var json =  _.clone(this.attributes);
			json.a = this.get('a').toJSON();
			json.b = this.get('b').toJSON();
			return json;	
		}

	});
});