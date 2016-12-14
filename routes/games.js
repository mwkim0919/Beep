var express = require('express');
var router = express.Router();
var passport = require('passport');

var Game = require('../models/game.js');
var Player = require('../models/player.js');

router.get('/', function(req, res, next) {
    Game.find({user: req.user})
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
    Game.find({player: req.params.id})
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
    Player.findById(req.body.player, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {
            console.log("No team found for the player");
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (doc) {
            var game = new Game({
                player: doc,
                date: req.body.date,
                opponent: req.body.opponent,
                pts: req.body.pts,
                reb: req.body.reb,
                ast: req.body.ast,
                stl: req.body.stl,
                blk: req.body.blk,
                tov: req.body.tov,
                fgm: req.body.fgm,
                fga: req.body.fga,
                tpm: req.body.tpm,
                tpa: req.body.tpa,
                min: req.body.min,
            });
            game.save(function (err, result) {
                if (err) {
                    return res.status(404).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                doc.games.push(result);
                doc.save();
                res.status(201).json({
                    message: 'Saved game',
                    obj: result
                });
            });
        }
    })
});

router.delete('/:id', function(req, res, next) {
    Game.findById(req.params.id, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No game found',
                error: {message: 'Game could not be found'}
            });
        }
        if (JSON.stringify(doc.user) != JSON.stringify(req.user._id)) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {message: 'Game created by other user'},
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
    Game.findById(req.params.id, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No game found',
                error: {message: 'Game could not be found'}
            });
        }
        if (JSON.stringify(doc.user) != JSON.stringify(req.user._id)) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {message: 'Game created by other user'},
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