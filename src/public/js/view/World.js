define(['backbone', 'easel', 'underscore'], function(Backbone, E, _) {
	return Backbone.View.extend({

		container : null,
		shape : null,
		bitmap : null,

		initialize : function() {
			this.bitmap = new E.Bitmap('img/worlds/world1.1.png');
			this.bitmap.regX = 777/ 2;//this.bitmap.width * .5;
			this.bitmap.regY = 2087;
			
			this.container = new E.Container();

			this.container.addChild(this.shape);
			//this.container.addChild(this.bitmap);
			this.container.mouseEnabled = false;
		},

		render : function() {
		}
	});
});