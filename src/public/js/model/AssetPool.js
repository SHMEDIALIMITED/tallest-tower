define(
		['backbone','easel'],

		function(Backbone, E) {

			var items = [];
			var assets = [];
			var index;
			return _.extend({

				loaded : function() {
					if(items.length == 0) return false;
					var i = items.length;
					while( --i > -1 ){
						if(!items[i].loaded) {
							return false;
						}
					} 
					return true;
				},

				add : function(item) {
					if(this.get(item)) return;
					items.push({url: item});
				},

				load : function() {
					index = 0;
					this.loadItem();
				},	

				loadItem: function() {
					var item = items[index];
					if(item.loaded) {
						this.loadNext();
						return;
					}

					item.type = item.url.substr(item.url.lastIndexOf('.')+1 );

					
					switch(item.type) {

						case 'json' : 
							$.ajax({'url': item.url,
        							'dataType': 'json',
        							'success': _.bind(this.onJSONLoaded, this)
        							});
						break;


						default :
							var image = new Image();
							image.onload = _.bind(this.loadNext, this);
							image.src = item.url;
							item.asset = image;
						break;
					}
					
				},

				onJSONLoaded : function(res) {
					var item = items[index];
					item.asset = res;
					this.loadNext();
				},

				loadNext : function() {
					items[index].loaded = true;
					index++;
					if(index < items.length) this.loadItem();
					else {
						this.trigger('complete');
					}
				},

				get:function(url) {
					if(!url) return items;
					var i = items.length;
					while( --i > -1 ){
						if(items[i].url == url) {
							return items[i].asset;
						}
					} 
				},



			}, Backbone.Events);	

		}

);