var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Player = require('../models/player.js');
var Team = require('../models/team.js');

router.get('/', function(req, res, next) {
    Player.find({user: req.user})
    .exec(function(err, docs) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: docs
        });
    });
});

router.get('/:id', function(req, res, next) {
    Player.find({team: req.params.id})
    .exec(function(err, docs) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: docs
        });
    });
});

router.post('/', function(req, res, next) {
    Team.findById(req.body.team, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {

        }
        if (doc) {
            var player = new Player({
                user: req.user,
                name: req.body.name,
                team: doc,
            });
            player.save(function(err, result) {
                if (err) {
                    return res.status(404).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                console.log('Got Result');
                doc.players.push(result);
                console.log('Pusing player result to team');
                doc.save();
                console.log('Saving team info');
                res.status(201).json({
                    message: 'Saved player',
                    obj: result
                });
            });
        }
    });
});

router.delete('/:id', function(req, res, next) {
    Player.findById(req.params.id, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No player found',
                error: {message: 'Player could not be found'}
            });
        }
        if (JSON.stringify(doc.user) != JSON.stringify(req.user._id)) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {message: 'Player created by other user'},
            });
        }
        doc.remove(function(err, result) {
            if (err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: result
            });
        });
    });
});

router.patch('/:id', function(req, res, next) {
    Player.findById(req.params.id, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No player found',
                error: {message: 'Player could not be found'}
            });
        }
        if (JSON.stringify(doc.user) != JSON.stringify(req.user._id)) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {message: 'Player created by other user'},
            });
        }
        doc.name = req.body.name;
        doc.players.push(req.body.player);
        doc.save(function(err, result) {
            if (err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: result
            });
        });
    });
});

module.exports = router;

