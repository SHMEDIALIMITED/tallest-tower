define(
	
	['backbone',  
	'underscore',
	'view/FeatureListView'], 

	function(Backbone, _, template, FeatureListView) {
	
	return Backbone.View.extend({

		id: 'create',

		

		initialize : function(options) {
			this.featureList = options.featureList;
		},

		render : function() {

			this.game = new Game();

			var t = _.template(template);
			this.$el.append(t);

			console.log(this.featureList.el);
			this.$el.append(this.featureList.el)
		}
	});
});