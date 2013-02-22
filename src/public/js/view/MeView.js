define(
	
	['backbone',
	'text!templates/me.html',
	'facebook',
	'SignalMap'], 

	function(	Backbone,
				template,
				FB,
				SignalMap) {
	
	return Backbone.View.extend({

		el: '#me',

		events : {
			'click .login-btn'	: 'login',
			'click #logout-btn'	: 'logout'
		},

		logout: function(e){
		
			FB.logout(function(response) {
				this.model.unset('facebook')
				$.cookie('fbsr_490996157610487', null);	
				this.enterLobby();
			});
			
			//this.router.navigate('/lobby', true);
		},

		login: function(e) { 
			console.log('doLogin')
			e.preventDefault();
			FB.login(FB.loginResponse)
			SignalMap.showPopup.dispatch('loading', true);
		},

		onClick: function() {
			//this.model.set({cash:50});
		},

		initialize : function(options) {
			this.listenTo(this.model, "change", this.render);
			this.render();
		},

		render : function() {
			var data = this.model.toJSON();
			data.loggedIn = data.facebook ? true : false;
			this.$el.html(_.template(template, data));
			return this;
		}
	});
});