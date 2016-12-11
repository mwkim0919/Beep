var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Team = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	name: {type: String, required: true},
	players: [{type: Schema.Types.ObjectId, ref: 'Player'}],
});

Team.post('remove', function(doc) {
	var deletedTeam = doc;
	console.log(doc);
	User.findById(doc.user, function(err, doc) {
		doc.teams.pull(deletedTeam);
		doc.save();
	});
});

module.exports = mongoose.model('Team', Team);