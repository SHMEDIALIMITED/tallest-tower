define( 
	['backbone',
	'easel'],

	function(Backbone, E) {
		var _timeout = 0;
		return Backbone.View.extend({

			initialize: function() {
				this.container = new E.Container();
				this.txt = new E.Text("", "72px Wendy One", "#FFF");
				this.container.addChild(this.txt);
				this.container.mouseChildren = false;
				this.container.mouseEnabled = false;
			},

			release : function() {
				this.container.removeChild(this.txt);
				this.txt = null;
				this.container = null;
			},

			render : function(text) {
				this.txt.text = text;
				this.txt.x = - this.txt.width * .5;
				this.txt.y = - this.txt.height * .5;
				this.show();
			},

			resize : function() {
				this.container.x = window.innerWidth * .5;
				this.container.y = window.innerHeight * .5;
			},

			show : function () {
				clearTimeout(_timeout);
				
			
				
				_timeout = setTimeout(function() {
					if(_timeout != 0) this.$el.fadeOut(200);
					_timeout = 0;
				}, 300);
				this.$el.fadeIn(200);
			
				
				
				
				return this;
			},

			hide : function () {
				
				if(this.catious == null) {
					if(_timeout != 0) {
						this.$el.fadeOut(200);
						_timeout = 0;
					}
				}else {
					if(_timeout != 0) {
						clearTimeout(_timeout);
						_timeout = 0;
						this.$el.fadeOut(200);
					} 
				}
				
				return this;
			}		

		});

	});