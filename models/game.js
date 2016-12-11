var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
	player: {type: Schema.Types.ObjectId, ref: 'Player', required: true},
	date: {type: Date, required: true},
	opponent: {type: Schema.Types.ObjectId, ref: 'Team', required: false},
	pts: {type: Number, required: true},
	reb: {type: Number, required: true},
	ast: {type: Number, required: true},
	stl: {type: Number, required: true},
	blk: {type: Number, required: true},
	tov: {type: Number, required: true},
	min: {type: Number, required: true},
});

Game.post('remove', function(doc) {
	var deletedGame = doc;
	console.log(doc);
	Player.findById(doc.user, function(err, doc) {
		doc.teams.pull(deletedGame);
		doc.save();
	});
});

module.exports = mongoose.model('Game', Game);