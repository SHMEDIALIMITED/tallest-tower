

module.exports = function (app, config) { 

	var pages = require('../app/controllers/pages');
	var users = require('../app/controllers/users')(config);
	var users = require('../app/controllers/games')(config);

	// Backbone App
	app.get('/', pages.index);
	
	// REST API 
	// 	/users
	app.post('/api/users', users.create);	

	app.get('/api/users', users.read);
	app.get('/api/users/:id', users.read);
	
	app.put('/api/users', users.update);
	app.put('/api/users/:id', users.update);

	app.delete('/api/users', users.del);
	app.delete('/api/users/:id', users.del);


	// 	/games
	app.post('/api/games', games.create);	

	app.get('/api/games', games.read);
	app.get('/api/games/:id', games.read);
	
	app.put('/api/games', games.update);
	app.put('/api/games/:id', games.update);

	app.delete('/api/games', games.del);
	app.delete('/api/games/:id', games.del);
}