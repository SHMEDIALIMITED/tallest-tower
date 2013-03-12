//var Feature = require('app/models').Feature;


module.exports = function(config) {
	var api = {};

	api.index = function(req, res) {


		res.render('index', {layout:false,locals:{title: 'Tallest Tower', description:'Tallest Tower Facebook game.', fbAppID: config.facebook.clientID}});
	}

	api.canvas = function(req, res) {
		res.redirect('/');
	}
	return api;
}