define(
	[	'backbone',
		'easel',
		'view/Bolt'	,
		'text!templates/game-score.html',],

	function(Backbone, E, Bolt, template) {

		return Backbone.View.extend({

			className: 'game-score',

			initialize : function() {
				this.model.on('change:height', this.render, this);
			},

			render: function() {
				this.$el.empty().append(_.template(template, this.model.toJSON()));
				return this;
			},

			release: function() {
				this.model.off('change:height', this.render, this);
				this.model = null;
			}

		});


});