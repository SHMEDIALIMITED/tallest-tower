//var Feature = require('app/models').Feature;

// SERVER RENDERED
exports.index = function(req, res) {
	res.render('index', {title: 'Tallest Tower', description:'Tallest Tower Facebook game.'});
}

exports.canvas = function(req, res) {
	res.redirect('/');
}

// // CLIENT RENDERED
// epxorts.create = function(req, res) {
// 	Feature.find(function(features) {
// 		return features; 
// 	}) 
// }