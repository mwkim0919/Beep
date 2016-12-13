var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user');
var Player = require('../models/player');

var Team = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	name: {type: String, required: true},
	players: [{type: Schema.Types.ObjectId, ref: 'Player'}],
});

Team.post('remove', function(doc) {
	var deletedTeam = doc;
	User.findById(doc.user, function(err, doc) {
		doc.teams.pull(deletedTeam);
		doc.save();
	});
});

Team.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
    this.model('Player').remove({ team: this._id }, next);
});

module.exports = mongoose.model('Team', Team);