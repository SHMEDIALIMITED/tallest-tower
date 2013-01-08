
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { title: 'SH MEDIA' , description:'Basic Web App Template'});
};