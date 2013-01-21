define(

	['backbone',
	'text!templates/feature-list-item.html'], 
	
	function(Backbone, template) {

	return Backbone.View.extend({

		tagName : 'li',

		className : 'feature-list-item',

		events: {
			'click' : 'onClick'
		},

		onClick : function(e) {
			//console.log(this.model.get('price'));
			this.$el.find('input[type=checkbox]').attr('checked', !this.getSelected());
			if(this.getSelected()) {
				this.$el.find('label').addClass('active');

			} else {
				this.$el.find('label').removeClass('active')
			}
			e.preventDefault();
			this.trigger('clicked', this.model);
		},

		render: function() {
			this.$el.append(_.template(template, this.model.attributes));
			return this;
		},

		release : function() {
			this.undelegateEvents();
			this.model = null;
		},

		getSelected: function() {
			return this.$el.find('input[type=checkbox]').attr('checked') ? true : false;
		},

		seSelected : function() {
			this.$el.find('input[type=checkbox]').attr('checked', false);
		},

		enable : function() {
			//console.log('disable', this.$el.find('label'))
			console.log('enable')
			this.delegateEvents();
			this.$el.find('label').removeClass('disabled');
			this.$el.find('input').prop('disabled', false);
		},

		disable: function() {
			console.log('disable');
			if(this.getSelected()) return;
			this.$el.find('label').addClass('disabled');
			this.undelegateEvents();
			this.$el.find('input').prop('disabled', true);
		}

	});

});