var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Player = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	name: {type: String, required: true},
	birthdate: {type: Date, required: false},
	team: {type: Schema.Types.ObjectId, ref: 'Team'},
	games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
});

Player.post('remove', function(doc) {
	var deletedPlayer = doc;
	console.log(doc);
	User.findById(doc.user, function(err, doc) {
		doc.teams.pull(deletedPlayer);
		doc.save();
	});
});

module.exports = mongoose.model('Player', Player);