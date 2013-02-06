define(['backbone', 'easel', 'underscore'], function(Backbone, E, _) {
	return Backbone.View.extend({

		container : null,
		shape : null,
		bitmap : null,

		initialize : function() {
			_.bindAll(this, 'clicked');
			_.bindAll(this, 'mouseOver');
			_.bindAll(this, 'mouseOut');
			

			this.shape = new E.Shape();
			var g = this.shape.graphics;
			g.beginFill('#990000');
			g.drawCircle(0,0,10);
			g.endFill();
				
			this.container = new E.Container();

			this.container.addChild(this.shape);
			
			console.log('model', this.model);
			this.model.on('change:fixed', this.draw, this);
			this.draw();
		},

		draw : function(){
			
			var assetURL;
			this.container.removeChild(this.bitmap);

			if(this.model.get('fixed')) {
				this.bitmap = new E.Bitmap('img/game/fixed_bolt.png');
				this.bitmap.regX = 33;
				this.bitmap.regY = 33;	
			}else {
				this.bitmap = new E.Bitmap('img/bolt.png');
				this.bitmap.regX = 25;
				this.bitmap.regY = 25;
			}
				
			this.bitmap.onPress = this.clicked;
			this.bitmap.onMouseOver = this.mouseOver;
			this.bitmap.onMouseOut = this.mouseOut;
			this.container.addChild(this.bitmap);
		},	

		setSelected :function(val) {
			this.selected = val;
			if(val) 
				this.shape.graphics.clear().beginFill('rgba(0,255,0,0.5)').drawCircle(0,0,35).endFill();
			else 
				this.shape.graphics.clear();
		},

		clicked : function() {
			this.trigger('selected', this);
		},

		mouseOver : function() {
			if(!this.selected)this.shape.graphics.clear().beginFill('rgba(255,0,255,0.5)').drawCircle(0,0,35).endFill();
		},

		mouseOut :  function() {
			if(!this.selected) this.shape.graphics.clear();
		},

		render : function() {
			this.container.x = this.model.get('x');
			this.container.y = this.model.get('y');
		},

		release : function() {
			console.log('Bolt:release')
			delete this.bitmap.onPress;
			delete this.bitmap.onMouseOut;
			delete this.bitmap.onMouseOver;
			this.container.removeChild(this.bitmap);
			this.container.parent.removeChild(this.container);
			this.bitmap = null;
			this.container = null;
		}
	});
});