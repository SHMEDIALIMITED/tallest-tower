//var Feature = require('app/models').Feature;

var fs=  require('fs');
fs.readFile('./package.json', 'utf8', function(err,data) {
	var json = 	data;
	console.log(json)
});
	
module.exports = function(config) {
	var api = {};

	

	api.index = function(req, res) {


		res.render('index', {layout:false,locals:{version:config.version, title: 'Tallest Tower', description:'Tallest Tower Facebook game.', fbAppID: config.facebook.clientID}});
	}

	api.canvas = function(req, res) {
		res.redirect('/');
	}
	return api;
}