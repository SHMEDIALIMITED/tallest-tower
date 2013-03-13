define( 
	['backbone',
	'easel',
	'tween'],

	function(Backbone, E, Tween) {
		var _timeout = 0;
		return Backbone.View.extend({

			initialize: function(options) {
				console.log(options);
				this.destroy = (options && options.destroy) ? true : false;
				this.container = new E.Container();
				this.txt = new E.Text("", "80px Wendy One", "#E2B230");
				this.txt.textAlign = 'center';
				if(this.destroy) {
					this.container.x = options.point.x;
					this.container.y = options.point.y;
					console.log(point)
				}
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
				if(!this.destroy) {
					this.txt.x = 0
					this.txt.y = -200;
				}
				this.show();
				return this;
			},

			resize : function() {
				this.container.x = window.innerWidth * .5;
				this.container.y = window.innerHeight * .5;
				return this;
			},

			show : function () {
				clearTimeout(_timeout);
				if(this.destroy) {
					
					this.txt.alpha = 100;
					this.txt.scaleX = this.txt.scaleX = 0.85;
					this.txt.y = 0;
					var that = this;
					_timeout = setTimeout(function() {
						if(_timeout != 0) E.Tween.get(that.txt).to({alpha:0, scaleX:0.8, scaleY:0.8, y: -200},699).call(function() {
							if(that.destroy) {
								that.container.parent.removeChild(that.container);
								that.release();
							}
						});
						_timeout = 0;
					}, 300);
					E.Tween.get(this.txt).to({alpha:1, scaleX:1, scaleY:1},100);
				}else {
					this.txt.alpha = 0;
					this.txt.scaleX = this.txt.scaleX = 0.85;
					this.txt.y = -150;
					var that = this;
					_timeout = setTimeout(function() {
						if(_timeout != 0) E.Tween.get(that.txt).to({alpha:0, scaleX:0.8, scaleY:0.8, y: -500},300).call(function() {
							if(that.destroy) {
								that.container.parent.removeChild(that.container);
								that.release();
							}
						});
						_timeout = 0;
					}, 900);
					E.Tween.get(this.txt).to({alpha:1, scaleX:1, scaleY:1},100);
				}
				
			
				
				
				
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