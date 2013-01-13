define(['backbone', 'easel'], function(Backbone, E) {
	return Backbone.View.extend({

		container : null,
		shape : null,
		bitmap : null,

		initialize : function() {

			this.container = new E.Container();
			
			this.shape = new E.Shape();
		
			var g = this.shape.graphics;
			
			g.setStrokeStyle(1);
			g.beginStroke(E.Graphics.getRGB(0,0,0));
			g.drawCircle(0,0,10)
			g.moveTo(-50,0);
			g.lineTo(50,0);
			g.endFill();
					
			

			this.bitmap = new E.Bitmap('img/stick.png');
			//this.container.addChild(this.shape);
			this.container.addChild(this.bitmap);
		},

		render : function() {
			this.container.x = this.model.get('x');
			this.container.y = this.model.get('y');

			this.bitmap.regX = .5;
	       	this.bitmap.regY = 10;
	       	this.bitmap.scaleX = this.model.get('length');
	       	this.container.rotation = this.model.get('rotation')
	       
		}

	});
});