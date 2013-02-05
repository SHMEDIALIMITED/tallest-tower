define(
	[	'backbone',
		'easel',
		'view/Bolt'	],

	function(Backbone, E, Bolt) {

		return Backbone.View.extend({

			initialize : function() {
				this.container = new E.Container();
				this.container.mouseEnabled = false;
				this.shape = new E.Shape();
				this.bitmap = new E.Bitmap('img/bolt.png');
				this.bitmap.regX = 25;
				this.bitmap.regY = 25;
				this.bitmap.alpha = 0.5;
				this.bitmap.mouseEnabled = false;
				this.container.addChild(this.shape);
				this.container.addChild(this.bitmap);
			},

			render: function(mouse, d) {
				

				var g = this.shape.graphics;
				g.clear();

				g.beginFill(E.Graphics.getRGB(200,200,200, 0.5));
				g.setStrokeStyle(3);
				g.beginStroke(E.Graphics.getRGB(255,255,255, 0.5));
				g.drawRoundRect(-10, 0, 20, d, 2);

				g.endFill();

				g.setStrokeStyle(2);
				g.beginStroke(E.Graphics.getRGB(0,0,0, 0.5));
				g.moveTo(0,0);
				g.lineTo(0, d);

				this.bitmap.y = d;
				

				this.container.rotation = (Math.atan2(this.model.get('x') - mouse.x, this.model.get('y') - mouse.y)/Math.PI)*-180 + 180;
				this.container.x = this.model.get('x');
				this.container.y = this.model.get('y'); 
				return this;
			}

		});


});