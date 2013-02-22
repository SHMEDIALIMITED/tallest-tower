define(
	['backbone',
	'SignalMap',
	'facebook',
	'text!templates/login-popup.html',
	'text!templates/loading-popup.html',
	'text!templates/game-saved-popup.html',
	'text!templates/game-data-saved-popup.html'], 

	function(Backbone, SignalMap, FB,

			login, loading,gameSuccess, gameDataSuccess) {

			
			var _timeout = 0;
		
		var Popup =	Backbone.View.extend({

			id : 'popup',


			
			events : {
				'click #confirm-btn': 'onClick',
				'click #login-btn': 'onLoginClick',
				'click #close-btn': 'onCloseClick'
			},

			onClick: function(e) {
				SignalMap.popupAction.dispatch(e);
			},

			onCloseClick: function(e) {
				SignalMap.popupAction.dispatch('lobby');
			},


			onLoginClick: function(e) {
							
				FB.login(_.bind(FB.loginResponse, this));
			},

			



			initialize : function() {

			},

			render : function(type, data) {
				var template;
				switch(type) {
					case 'loading' : template = loading; break;
					case 'login' : template = login; break;
					case 'gameSuccess' : template = gameSuccess; break;
					case 'gameDataSuccess' : template = gameDataSuccess; break;
				}

				console.log(data);

				this.$el.empty().append(_.template(template, data));
					
				return this;
			},

			show : function (catious) {
				clearTimeout(_timeout);
				this.catious = catious;
			
				if(catious) {
					_timeout = setTimeout(_.bind(function() {
						if(_timeout != 0) this.$el.fadeIn(200);
					}, this), 300);
				}else {
					_timeout = setTimeout(function() {
						if(_timeout != 0) this.$el.fadeOut(200);
						_timeout = 0;
					}, 300);
					this.$el.fadeIn(200);
				}
				
				
				
				return this;
			},

			hide : function () {
				
				if(this.catious == null) {
					if(_timeout != 0) {
						this.$el.fadeOut(200);
						_timeout = 0;
					}
				}else {
					if(_timeout != 0) {
						clearTimeout(_timeout);
						_timeout = 0;
						this.$el.fadeOut(200);
					} 
				}
				
				return this;
			}

		});
		Popup.LOADING = 'loading';
		Popup.LOGIN = 'login';	
		Popup.ERROR = 'error';

		return Popup;

	});