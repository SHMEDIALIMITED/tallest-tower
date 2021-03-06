var mongoose = require('mongoose');
var Schema = mongoose.Schema;  

var Point = new Schema({
	x : {type: Number},
	y : {type: Number},
	type : {type: Number},
	fixed : {type: Boolean}
});

var Stick = new Schema({
	a : {type: Schema.Types.Mixed},
	b : {type: Schema.Types.Mixed	},
	rotation : { type:Number },
	length : { type:Number },
	type : {type: Number},
	x : { type:Number },
	y : { type:Number }
});

var User = new Schema({ 
	fbID: {type: Number},
	cash: { type:Number, default:100 },
	games: [Schema.Types.ObjectId],
    modified: { type: Date, default: Date.now }
});

var GameData = new Schema({ 
	fbID: { type: Number }, 
    points: [Point],  
    sticks : [Stick],
    features : [GameFeature],
    height: { type : Number},
    modified: { type: Date,  default: Date.now }
});

var Feature = new Schema({
	price : { type: Number },
	image : {type: String },
	type : { type: Number },
	factor : {type: Number}
});

var GameFeature = new Schema({
	image : {type: String },
	name : {type: String},
	type : { type: Number },
	amount : {type: Number, default: 0},
	used : {type:Number, default:0}
});

var Game = new Schema({
	name : {type:String},
	fbID : { type:Number },
	value : {type: Number},
	days : {type: Number},
	data: [GameData],
	features: [GameFeature],
	users : [Number],
	created : { type: Date, default: Date.now }
});

module.exports = { 
	User : mongoose.model('User', User),
	Game : mongoose.model('Game', Game),
	Feature : mongoose.model('Feature', Feature),
	GameFeature : mongoose.model('GameFeature', GameFeature),
	GameData : mongoose.model('GameData', GameData)
}