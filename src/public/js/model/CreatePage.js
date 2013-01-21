define(
	
		['backbone'],

function(Backbone) {
			
	return Backbone.Model.extend({

		url: '/pages/create',

		
		
		

		toJSON: function() {
			var json = this.clone();
			json.features = this.get('features').toJSON();
		}

		
	});

});