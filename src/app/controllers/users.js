var Models = require('../models');


module.exports = function(config) {

    var User = Models.User;

	var api = {};

	api.read = function(req,res) {
        var id = req.userID;
	    User.findOne({fbID: id}, function(err, user) {
            res.send(user);
        }); 
    }

	api.create = function(req, res) {
        if(req.userID) {
            User.findOne({fbID: req.userID},  function (err, user) {
            
                if(user) {
                    res.send(user);
                }else {
                    console.log('CRATED NEW USER');
                    
                    var data = req.body;

                    data.fbID = req.userID;
                    //console.log('BODY', JSON.stringify(data));
                    user = new User(data);
            
                    //console.log('DB MODEL', user.sticks);
                    user.save(function(err, user) {
                        console.log('USER SAVED', user)
                        res.send(user);
                    });
                }
            });
        }
	}

	api.update = function(req, res) {

	}

	api.del = function(req, res){

	}

	return api;
}








    
