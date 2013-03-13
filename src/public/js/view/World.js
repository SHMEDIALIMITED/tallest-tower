define(['backbone', 'easel', 'underscore'], function(Backbone, E, _) {
	return Backbone.View.extend({

		container : null,
		shape : null,
		bitmap : null,
		layers : [],

		initialize : function() {
			
			_.bindAll( this, 'render');	
			this.container = new E.Container();

			
			
			this.container.mouseEnabled = false;
		},

		release:function() {
			_.each(this.layers, function(layer) {
				var cell;
				layer.removeAllChildren();
				// while(layer.numChildren != 0) {
				// 	console.log('REMOVE  CELL')
				// 	cell = layer.removeChildAt(0);
				// }
			});
		},

		resize: function() {
			this.numX = Math.ceil(window.innerWidth / 120);
			this.numY = Math.ceil(window.innerHeight / 120);

		},

		load : function(data, image) {
			if(this.loaded) return true;
			var imageData = {
				images : [ image ],
				frames : {
					width : 64,
					height : 64
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
				this.layers.push(layer);
				this.initLayer(layer, layerData, tilesetSheet, data.tilewidth, data.tileheight);
			}, this)
			this.layers.reverse();



			this.loaded = true;
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
					cellBitmap.x = x * tilewidth - tilewidth / 2 - tilewidth * layerData.width/ 2;
					cellBitmap.y = y * tileheight - tileheight * layerData.height + 300;
					// add bitmap to stage
					layer.addChild(cellBitmap);
				}
			}
		},

		addGameLayer:function(layer) {
			this.container.getChildAt(0).addChild(layer);
		},

		render : function(height) {
			var i =0; 
			var l = i = this.layers.length;
			
			//this.container.getChildAt(2).y = -this.data.height * this.data.tileheight + (height+270) ;
			//this.container.getChildAt(1).y = -this.data.height * this.data.tileheight + (height+270) / 2; /// 2;
			//this.container.getChildAt(0).y = -this.data.height * this.data.tileheight + (height+270) / 4;
			while( --i > -1) {
				var child = this.layers[i];
				child.y =  height / (i+1);
				
				child.scaleX = child.scaleY = 0.8- i*0.2

				
			}
			
		}
	});
});