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
	cash: { type:Number },
	games: [Schema.Types.ObjectId],
    modified: { type: Date, default: Date.now }
});

var GameData = new Schema({ 
	fbID: { type: Number }, 
    points: [Point],  
    sticks : [Stick],
    height: { type : Number},
    modified: { type: Date,  default: Date.now }
});

var Feature = new Schema({
	price : { type: Number },
	image : {type: String },
	type : { type: String, enum: [ 'Fixed Bolt', 'Rod', 'Long Rod', 'Wind' ] },
	factor : {type: Number}
});

var Game = new Schema({
	value : {type: Number},
	data: [GameData],
	features: [Feature],
	users : [Number],
    modified: { type: Date, default: Date.now }
});

module.exports = { 
	User : mongoose.model('User', User),
	Game : mongoose.model('Game', Game),
	Feature : mongoose.model('Feature', Feature),
	GameData : mongoose.model('GameData', GameData)
}