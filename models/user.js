var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	username: String,
	password: String,
	teams: [{type: Schema.Types.ObjectId, ref: 'Team'}],
	players: [{type: Schema.Types.ObjectId, ref: 'Player'}],
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);