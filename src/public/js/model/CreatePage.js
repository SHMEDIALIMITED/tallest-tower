define('CreatePage',
	
		['backbone'],

function(Backbone) {
			
	return Backbone.Model.extend({

		url: '/pages/create',

		defaults {
			features : new Backbone.Collection({model:Backbone.Model});
		},
		
		

		toJSON: function() {
			var json = this.clone();
			json.features = this.get('features').toJSON();
		}

		
	});

});