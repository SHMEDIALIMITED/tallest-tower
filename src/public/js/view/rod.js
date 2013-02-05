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
					
			var assetURL;
			switch(this.model.get('type')) {
				case  0 :
					assetURL = 'img/bolt.png';
				break;

				case  1 :
					assetURL = 'img/bamboo_rod';
				break;

				case  2 :
					assetURL = 'img/bamboo_rod';
				break;

				case  3 :
					assetURL = 'img/copper_rod';
				break;

				case  4 :
					assetURL = 'img/copper_rod';
				break;

				case  5 :
					assetURL = 'img/metal_rod';
				break;

				case  6 :
					assetURL = 'img/metal_rod';
				break;
			} 
			assetURL += '.png';


			var i = Math.ceil(this.model.get('length') / 100);
			var l = i;
			this.bitmap = new E.Container();
			var bitmap;
			while( --i > -1 ) {
				bitmap = new E.Bitmap(assetURL);
				bitmap.x = i * 100;
				this.bitmap.addChild(bitmap);
			}

			this.bitmap.x = -l* 50;	
			this.bitmap.y = -10;	

			//this.container.addChild(this.shape);
			this.container.addChild(this.bitmap);
		},

		render : function() {
			this.container.x = this.model.get('x');
			this.container.y = this.model.get('y');
	       	this.container.rotation = this.model.get('rotation')
		}

	});
});