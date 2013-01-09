
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { title: 'SH MEDIA' , description:'Basic Web App Template'});
};


exports.games = function(req,res) {
	res.json({ 
		id: 1,
		points: [{x:-100, y:0}, {x:100, y:0}],  
		sticks: [],
		score : {height:100, time:200},
		modified: new Date()  
	});
}