define(
	[	'backbone',
		'easel',
		'view/Bolt'	,
		'text!templates/count-down.html',],

	function(Backbone, E, Bolt, template) {

		return Backbone.View.extend({

			className: 'count-down',

			initialize : function() {
				//this.model.on('change:height', this.render, this);
			},

			render: function() {

				this.$el.empty().append(_.template(template, {hrs: 22, mins:45, secs:70}));
				return this;
			},

			release: function() {
				this.model.off('change:height', this.render, this);
				this.model = null;
			}

		});


});