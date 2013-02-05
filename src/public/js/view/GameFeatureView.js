define(

	['backbone',
	'text!templates/game-feature.html'], 
	
	function(Backbone, template) {

	return Backbone.View.extend({

		tagName : 'li',

		className : 'btn game-feature',

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

		getEnabled: function() {
			return !this.$el.hasClass('disabled');
		},

		render: function() {
			console.log(this.model.attributes);
			this.$el.empty().append(_.template(template, this.model.attributes));
			return this;
		},

		enable : function() {
			//console.log('disable', this.$el.find('label'))
			
			this.delegateEvents();
			this.$el.removeClass('disabled').removeClass('active');
		},

		disable: function() {
			
		
			
			this.$el.addClass('disabled');
			this.undelegateEvents();
		},

		release : function() {
			this.undelegateEvents();
			this.model = null;
		}
	});
});