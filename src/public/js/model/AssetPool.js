define(
		['backbone','easel'],

		function(Backbone, E) {

			var items = [];
			var assets = [];
			var index;
			return _.extend({

				loaded : false,

				add : function(item) {
					items.push(item);
				},

				load : function() {
					index = 0;
					this.loadItem();
				},	

				loadItem: function() {
					var image = new Image();
					image.onload = _.bind(this.onItemLoaded, this);
					image.src = image.url = items[index];
					assets.push(new E.Bitmap(image));
					index++;	
				},

				onItemLoaded : function() {
					if(index < items.length) this.loadItem();
					else {
						this.loaded = true;
						this.trigger('complete');
					}
				},

				get:function(url) {
					var i = items.length;
					while( --i > -1 ){
						if(assets[i].image.url == url) {
							return assets[i].clone();
						}
					} 
				}


			}, Backbone.Events);	

		}

);