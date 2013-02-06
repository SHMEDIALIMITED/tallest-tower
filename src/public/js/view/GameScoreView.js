define(
	[	'backbone',
		'easel',
		'view/Bolt'	],

	function(Backbone, E, Bolt) {

		return Backbone.View.extend({

			className: 'game-score',

			initialize : function() {
				this.model.on('change:height', this.render, this);
			},

			render: function() {
				this.$el.empty().append(this.model.get('height')+ 'm');
				return this;
			},

			release: function() {
				this.model.off('change:height', this.render, this);
				this.model = null;
			}

		});


});