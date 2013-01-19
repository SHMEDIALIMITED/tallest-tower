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
	'app', 
	'jquery'
], function(App, $, FB) {
	$(document).ready(function() {
		App.init();
	});
});