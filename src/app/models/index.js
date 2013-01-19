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

var GameData = new Schema({ 
	fbID: { type: Number }, 
    points: [Point],  
    sticks : [Stick],
    height: { type : Number},
    modified: { type: Date, default: Date.now }
});

var Game = new Schema({
	wind : {type: Number},
	points: [Point],
	sticks: [Stick],
    data : [GameData],
    modified: { type: Date, default: Date.now }
});

var GameObject = new Schema({

});

var BoltType = new Schema({
	data: [GameObject]
});

module.exports = { 
	User : mongoose.model('User', User),
	Game : mongoose.model('Game', Game),
	BoltType : mongoose.model('Game', BoltType)
}