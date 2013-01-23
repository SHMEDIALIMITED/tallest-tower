require.config({
	urlArgs: 'cb=' + Math.random(),
	'paths': {
		'jquery': 'libs/jquery-1.8.3.min',
		'backbone': 'libs/backbone-min',
		'underscore': 'libs/underscore-min',
		'easel' : 'libs/easeljs-0.5.0.min',
		'facebook' : '//connect.facebook.net/en_US/all',
		'state-machine' : 'libs/state-machine.min'
	},
 
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		'easel': {
            exports: 'createjs'
        },
        'facebook' : {
            exports: 'FB'
        },
        'state-machine' : {
        	exports : 'StateMachine'
        } 
	}
});
 
require([
	'App', 
	'jquery',	
	'facebook',
	'model/User'
], function(App, $, FB, User) {

	$(function(){

		FB.init({
	      appId      : '490996157610487', // App ID
	      //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
	      status     : true, // check login status
	      cookie     : true, // enable cookies to allow the server to access the session
	    });

		var app; 
		var user = new User();
	   
		
	    FB.getLoginStatus(function (response) {
	    	console.log('STATUS', response.status)
	    	if(response.status == 'connected') {
	    		// USER AUTHORIZED
	    		
	    		user.fetch({success: function(model, response, options) {
	    			//console.log('USER fETCHED: ' , user);
					app = new App({model:user});
				}, error:function() {
					console.log('error')
				}});
	    		
	    	} else {
	    		// USER NOT LOGGED IN
	    		app = new App({model:user});
	    	} 
	    });

	})
});