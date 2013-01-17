

module.exports = function (app, config) { 

	var pages = require('../app/controllers/pages');
	var users = require('../app/controllers/users')(config);

	// Backbone App
	app.get('/', pages.index);
	
	// REST API 
	app.post('/api/users', users.create);	

	app.get('/api/users', users.read);
	app.get('/api/users/:id', users.read);
	
	app.put('/api/users', users.update);
	app.put('/api/users/:id', users.update);

	app.delete('/api/users', users.del);
	app.delete('/api/users/:id', users.del);
}