define(['backbone', 'easel'], function(Backbone, E) {
	return Backbone.View.extend({

		asset : null; 

		initialize : function() {
			this.asset = new E.Bitmap('img/stick');
		}

		render : function() {
			this.asset.x = this.model.get('x');
			this.asset.y = this.model.get('y');
		}

	});
});