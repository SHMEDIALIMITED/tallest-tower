require.config({
	baseUrl: "../js/",
  	urlArgs: 'cb=' + Math.random(),
	'paths': {
		'jquery': 'libs/jquery-1.8.3.min',
		'backbone': 'libs/backbone-min',
		'underscore': 'libs/underscore-min',
		'jasmine': '../test/libs/jasmine-1.3.1/jasmine',
    	'jasmine-html': '../test/libs/jasmine-1.3.1/jasmine-html',
		'spec': '../test/spec'
	},
 
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		jasmine: {
	      	exports: 'jasmine'
	    },
	    'jasmine-html': {
	      	deps: ['jasmine'],
	      	exports: 'jasmine'
	    }
	}
});
 
require(['underscore', 'jquery', 'jasmine-html'], function(_, $, jasmine){
 
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;
 
  var htmlReporter = new jasmine.HtmlReporter();
 
  jasmineEnv.addReporter(htmlReporter);
 
  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };
 
  var specs = [];
 
  specs.push('spec/sample.spec');

 
 
  $(function(){
    require(specs, function(){
      jasmineEnv.execute();
    });
  });
 
});