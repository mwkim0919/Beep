var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Team = require('../models/team');

router.get('/', function(req, res, next) {
    Team.find({user: req.user})
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
    var team = new Team({
        user: req.user,
        name: req.body.name,
        // players: [],
    });
    team.user = req.user;
    team.save(function (err, result) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        req.user.teams.push(result);
        req.user.save();
        res.status(201).json({
            message: 'Saved team',
            obj: result
        });
    });
});

router.delete('/:id', function(req, res, next) {
    Team.findById(req.params.id, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No team found',
                error: {message: 'Team could not be found'}
            });
        }
        if (JSON.stringify(doc.user) != JSON.stringify(req.user._id)) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {message: 'Team created by other user'},
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
    Team.findById(req.params.id, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No team found',
                error: {message: 'Team could not be found'}
            });
        }
        if (JSON.stringify(doc.user) != JSON.stringify(req.user._id)) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {message: 'Team created by other user'},
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

