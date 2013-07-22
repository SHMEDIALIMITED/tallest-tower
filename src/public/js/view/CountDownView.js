define(
	[	'backbone',
		'easel',
		'view/Bolt'	,
		'text!templates/count-down.html'],

	function(Backbone, E, Bolt, template) {

		return Backbone.View.extend({

			className: 'count-down',

			initialize : function() {
				_.bindAll(this, 'onTimer');
				var created = new Date(this.model.get('created'));
				var now = new Date();
				var gameTimeInHours = 0.1;
				var then = new Date(created.getTime() + gameTimeInHours  * 60 * 60 * 1000);



				if(then - now < 0 ) {
					this.trigger('time_run_out');
				}


				this.model.set({remaining: then - now})
				//this.model.set({remaining: 1000});
				this.model.on('change:remaining', this.render, this);


				this.onTimer();
				this.interval = setInterval(this.onTimer, 1000)
			},

			onTimer:function() {
				this.model.set({remaining: this.model.get('remaining') - 1000 });
				if(this.model.get('remaining') < 0) {
					this.trigger('time_run_out');
				}
			},

			render: function() {
				var remaining = this.model.get('remaining');
				var date = new Date(remaining);
				var data = {
					hrs: this._format(date.getHours()),
					mins : this._format(date.getMinutes()),
					secs : this._format(date.getSeconds())
				} 
				this.$el.empty().append(_.template(template, data));
				return this
			},

			_format : function(fragment) {

				return fragment < 10 ? '0' + fragment : fragment;
			},

			release: function() {
				if(this.model == null) return;
				this.model.off('change:remaining', this.render, this);
				this.model = null;
				clearInterval(this.interval);
				return this;
			}

		});


});