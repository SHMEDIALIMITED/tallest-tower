//var Feature = require('app/models').Feature;

// SERVER RENDERED
exports.index = function(req, res) {
	res.render('index', {title: 'Tallest Tower', description:'Tallest Tower Facebook game.'});
}

// // CLIENT RENDERED
// epxorts.create = function(req, res) {
// 	Feature.find(function(features) {
// 		return features; 
// 	}) 
// }