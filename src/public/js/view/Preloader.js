define(
	['backbone',
	'text!templates/preloader.html'], 

	function(Backbone,

			login, loading) {

		return Backbone.View.extend({

			el : '#preloader',

			initialize : function() {

			},

			render : function() {
				//this.$el.addClass('loading');
				this.$el.append(_.template(loading, {title: 'Loading'}));
				return this;
			}

		});

	});