require.config({
	//urlArgs: 'cb=' + Math.random(),
	'paths': {
		'jquery': 'libs/jquery-1.8.3.min',
		'backbone': 'libs/backbone-min',//'libs/backbone-0.9.10',
		'underscore': 'libs/underscore-min',
		'easel' : 'libs/easeljs-0.5.0.min',
		'facebook' : '//connect.facebook.net/en_US/all',
		'signal' : 'libs/signals.min',
		'preload' : 'http://code.createjs.com/preloadjs-0.3.0.min',
        'sugar' : 'https://raw.github.com/kitao/divsugar/master/build/divsugar',
        'tween' : 'http://code.createjs.com/tweenjs-0.4.0.min',
        'sound' : 'http://code.createjs.com/soundjs-0.4.0.min',
        'midi' : 'libs/midi',
        'WebMIDIAPI' : 'libs/WebMIDIAPI',
        'base64binary' : 'libs/base64binary',
        'Base64' : 'libs/Base64',
        'midifile': 'libs/jasmid/midifile',
        'replayer': 'libs/jasmid/replayer',
        'stream': 'libs/jasmid/stream',

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
        'signal' : {
        	exports : 'Signal'
        },

        'preload': {
            exports: 'createjs.PreloadJS',
            deps : ['easel']
        },

        'sugar' : {
            exports: 'sugar'
        },

        'tween' : {
        	exports : 'tween'
        },

        'sound' : {
        	exports : 'sound'
        },

        'midi': {
        	exports : 'MIDI',
        },

        'Base64' : {
        	exports : 'Base65'
        },


        'base64binary' : {
        	exports : 'base64binary'
        },

        'WebMIDIAPI' : {
        	exports : 'WebMIDIAPI',
        
        },

        'midifile' : {
            exports : 'midifile',
        
        },

         'replayer' : {
            exports : 'Replayer'
        },

        'stream' : {
            exports : 'Stream'
        }

	}
});
 
require([
	'App', 
	'jquery',	
	'facebook',
	'model/User',
	'view/Popup',
	'SignalMap',
    'midi',
    'base64binary'
], function(App, $, FB, User, Preloader, SignalMap) {
	


	
	var user = new User();
	FB.loginResponse = function(response) {	
		if(!response.authResponse) {
			SignalMap.popupAction.dispatch();
			return;
		}
		var that = this;

		

		FB.api('/me', function(me) {
			

			user.set({facebook:me});
			
			user.fetch({success:function(err, model) {
				if(!model) {
					user.save({},{success:function(err, model) {
						
						SignalMap.popupAction.dispatch();
					}, error : function() {
						
					}});
					return;
				}
				SignalMap.popupAction.dispatch();
			}, error : function() {
				
			}});


			// console.log('HERE------', that.model)
			
		});
	}

	$(function(){
        MIDI.audioDetect(function(supports) {
            console.log('detect', supports)
        });
        


        MIDI.loadPlugin({
      
        instrument: 18,
        callback: function() {
            var delay = 0; // play one note every quarter second
            var note = 50; // the MIDI note
            var velocity = 127; // how hard the note hits
            // play the note
            // 
            console.log('HERE   ')
            MIDI.setVolume(0, 127);
            MIDI.noteOn(0, note, velocity, delay);
            MIDI.noteOff(0, note, delay + 0.75);
        }
    });
        return;
		
		FB.init({
	      appId      : window.FB_APP_ID, // App ID
	      //channelUrl : 'http://localhost:3000/channel.html', // Channel File
	      status     : true, // check login status
	      cookie     : true, // enable cookies to allow the server to access the session
	    });

		var app; 
		
	   	

		
	    FB.getLoginStatus(function (response) {
	    	
	    	if(response.status == 'connected') {
	    		
	    		
	    		
				FB.api('/me', function(me) {
					

					user.set({facebook:me});
					
					user.fetch({success:function(err, model) {
						console.log('++++++', model)
						if(!model) {
							user.save({},{success:function(err, model) {
								
								app = new App({model:user});
							}, error : function() {
								
							}});
							return;
						}
						app = new App({model:user});
					}, error : function() {
						
					}});


					// console.log('HERE------', that.model)
					
				});
	    		
	    	} else  {
	    		// USER NOT LOGGED IN
	    		app = new App({model:user});
	    	} 
	    });

	})
});