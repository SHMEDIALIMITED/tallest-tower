
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { title: 'SH MEDIA' , description:'Basic Web App Template'});
};


exports.getGames = function(req,res) {

	res.json(game);
}

var game = { 
		id: 1,
		points: [{x:-100, y:0, fixed:true}, {x:100, y:0, fixed:true}],  
		sticks: [],
		score : {height:100, time:200},
		modified: new Date()  
	};

exports.saveGame = function(req, res) {
	game = req.body;

	console.log(game)
}

