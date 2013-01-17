var mongoose = require('mongoose');
var Schema = mongoose.Schema;  

var Point = new Schema({
	x : {type: Number},
	y : {type: Number},
	fixed : {type: Boolean}
});

var Stick = new Schema({
	a : {type: Schema.Types.Mixed},
	b : {type: Schema.Types.Mixed	},
	rotation : { type:Number },
	length : { type:Number },
	x : { type:Number },
	y : { type:Number }
});

var User = new Schema({ 
	fbID: {type: Number},
    time : {type: Number, default: 0},
    height : {type:Number, default: 0},
    points: [Point],  
    sticks : [Stick],
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserModel', User);