var env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , mongoose = require('mongoose');


describe("MongoDB", function() {
  it("Should connect to server passed by Strider via environment variables", function(done) {

  	
    
    mongoose.connect(config.db, function() {
    	done();
    })
    var key = "foo";
    var value = "this is my foo value";
   
  });
});