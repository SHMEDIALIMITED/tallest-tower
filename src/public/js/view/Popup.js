define(
	['backbone',
	'text!templates/login-popup.html',
	'SignalMap'], 

	function(Backbone, template, SignalMap) {

		return Backbone.View.extend({

			id : 'popup',

			events : {
				'click #facebook-login-btn': 'onClick'
			},

			onClick: function(e) {
				SignalMap.popupAction.dispatch(e);
			},

			initialize : function() {

			},

			render : function() {
				this.$el.append(_.template(template, {title: 'Login'}));
				return this;
			}

		});

	});