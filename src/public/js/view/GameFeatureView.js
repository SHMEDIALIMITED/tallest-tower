define(

	['backbone',
	'text!templates/game-feature.html'], 
	
	function(Backbone, template) {

	return Backbone.View.extend({

		tagName : 'li',

		className : 'btn feature-list-item',

		events: {
			'click' : 'onClick'
		},

		onClick : function(e) {
			this.trigger('clicked', this.model);
		},

		initialize : function() {
			this.listenTo(this.model, 'change:amount', this.render, this)
		},

		setSelected: function(val) {
			if(val) this.$el.addClass('active');
			else this.$el.removeClass('active');
		},

		render: function() {
			this.$el.empty().append(_.template(template, this.model.attributes));
			return this;
		},

		release : function() {
			this.undelegateEvents();
			this.model = null;
		}
	});
});