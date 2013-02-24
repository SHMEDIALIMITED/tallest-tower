define(['backbone', 'easel', 'underscore'], function(Backbone, E, _) {
	return Backbone.View.extend({

		container : null,
		shape : null,
		bitmap : null,

		initialize : function() {
			
			_.bindAll( this, 'render');	
			this.container = new E.Container();

			
			
			this.container.mouseEnabled = false;
		},

		resize: function() {
			this.numX = Math.ceil(window.innerWidth / 120);
			this.numY = Math.ceil(window.innerHeight / 120);

		},

		load : function(data, image) {
			var imageData = {
				images : [ image ],
				frames : {
					width : 60,
					height : 60
				}
			};
			this.data = data;
			var tilesetSheet = new E.SpriteSheet(imageData);

			// loading each layer at a time
			// 
			
			this.model.on('change:height', this.render);
			
			_.each(data.layers , function(layerData) {
				var layer = new E.Container();
				this.container.addChild(layer);
				this.initLayer(layer, layerData, tilesetSheet, data.tilewidth, data.tileheight);
			}, this)
			this.render(0);
 
		},


		initLayer: function(layer, layerData, tilesetSheet, tilewidth, tileheight) {
			for ( var y = 0; y < layerData.height; y++) {
				for ( var x = 0; x < layerData.width; x++) {
					// create a new Bitmap for each cell
					var cellBitmap = new createjs.BitmapAnimation(tilesetSheet);
					// layer data has single dimension array
					var idx = x + y * layerData.width;
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap.gotoAndStop(layerData.data[idx] - 1);
					// isometrix tile positioning based on X Y order from Tiled
					cellBitmap.x = x * tilewidth - tilewidth / 2 - 600
					cellBitmap.y = y * tileheight - 3600;
					// add bitmap to stage
					layer.addChild(cellBitmap);
				}
			}
		},

		render : function(height) {
			var i =0; 
			var l = this.container.children.length;
			
			//this.container.getChildAt(2).y = -this.data.height * this.data.tileheight + (height+270) ;
			//this.container.getChildAt(1).y = -this.data.height * this.data.tileheight + (height+270) / 2; /// 2;
			//this.container.getChildAt(0).y = -this.data.height * this.data.tileheight + (height+270) / 4;
			while( i < l) {
				var child = this.container.getChildAt(i);
				child.y =  height / (l - i)//i * (height*0.1) - i * 50;;
				child.x = i * 20;
				//child.scaleX = child.scaleY = (i+1) / l;
				i++;
			}
			
		}
	});
});