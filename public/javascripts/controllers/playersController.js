myApp.controller('playersController', 
	['$scope', '$location', 'TeamService', 'PlayerService', 'GameService',
	function($scope, $location, TeamService, PlayerService, GameService) {
		$scope.tableLabels = ["Name", "Team", "GP", "PPG", "RPG", "APG", "BLKPG", "SPG", "TOPG", "FG%", "3P%"];
		$scope.teams = {};
		$scope.players = {};
		$scope.games = {};
		$scope.averages = {};

		TeamService.getTeams()
		.then(function(response) {
			for (var i = 0; i < response.data.obj.length; i++) {
				var team = {
					id: response.data.obj[i]._id,
					name: response.data.obj[i].name,
				};
				$scope.teams[team.id] = team;
			}
		});

		PlayerService.getPlayers()
		.then(function(response) {
			for (var i = 0; i < response.data.obj.length; i++) {
				var player = {
					id: response.data.obj[i]._id,
					name: response.data.obj[i].name,
					team: response.data.obj[i].team,
				};
				$scope.players[player.id] = player;
				// GameService.getGamesByPlayer(player)
				// .then(function(response) {
				// 	$scope.games[player.id] = response.data.obj;
				// 	var gp=0, pts=0, reb=0, ast=0, stl=0, blk=0, tov=0,
				// 	fgm=0, fga=0, tpm=0, tpa=0;
				// 	for (var i = 0; i < response.data.obj.length; i++) {
				// 		gp += 1;
				// 		pts += response.data.obj[i].pts;
				// 		reb += response.data.obj[i].reb;
				// 		ast += response.data.obj[i].ast;
				// 		stl += response.data.obj[i].stl;
				// 		blk += response.data.obj[i].blk;
				// 		tov += response.data.obj[i].tov;
				// 		fgm += response.data.obj[i].fgm;
				// 		fga += response.data.obj[i].fga;
				// 		tpm += response.data.obj[i].tpm;
				// 		tpa += response.data.obj[i].tpa;
				// 	}
				// 	var fgp = fga != 0 ? (fgm/fga).toFixed(3) : 0;
				// 	var tpp = tpa != 0 ? (tpm/tpa).toFixed(3) : 0;
				// 	if (gp != 0) {
				// 		$scope.averages[player.id] = [gp, pts/gp, reb/gp, ast/gp, stl/gp, blk/gp, tov/gp, fgp, tpp];
				// 	} else if (gp == 0) {
				// 		$scope.averages[player.id] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
				// 	}
				// });
			}
		});

		// GameService.getGames()
		// .then(function(response) {

		// });

		// for (var id in $scope.players) {
		// 	GameService.getGamesByPlayer($scope.players[id])
		// 	.then(function(response) {
		// 		$scope.games[id] = response.data.obj;
		// 		var gp=0, pts=0, reb=0, ast=0, stl=0, blk=0, tov=0,
		// 		fgm=0, fga=0, tpm=0, tpa=0;
		// 		for (var i = 0; i < response.data.obj.length; i++) {
		// 			gp += 1;
		// 			pts += response.data.obj[i].pts;
		// 			reb += response.data.obj[i].reb;
		// 			ast += response.data.obj[i].ast;
		// 			stl += response.data.obj[i].stl;
		// 			blk += response.data.obj[i].blk;
		// 			tov += response.data.obj[i].tov;
		// 			fgm += response.data.obj[i].fgm;
		// 			fga += response.data.obj[i].fga;
		// 			tpm += response.data.obj[i].tpm;
		// 			tpa += response.data.obj[i].tpa;
		// 		}
		// 		var fgp = fga != 0 ? (fgm/fga).toFixed(3) : 0;
		// 		var tpp = tpa != 0 ? (tpm/tpa).toFixed(3) : 0;
		// 		if (gp != 0) {
		// 			$scope.averages[id] = [gp, pts/gp, reb/gp, ast/gp, stl/gp, blk/gp, tov/gp, fgp, tpp];
		// 		} else if (gp == 0) {
		// 			$scope.averages[id] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		// 		}
		// 	});
		// }
	}
]);