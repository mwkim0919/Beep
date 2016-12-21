myApp.controller('playersController', 
	['$scope', '$location', 'TeamService', 'PlayerService', 'GameService',
	function($scope, $location, TeamService, PlayerService, GameService) {
		$scope.sortType     = 'name';
		$scope.sortReverse  = false;
		$scope.searchFish   = '';

		$scope.tableLabels = ["name", "team", "gp", "ppg", "rpg", "apg", "blkpg", "spg", "topg", "FG%", "3P%"];
		$scope.teams = {};
		$scope.players = {};
		$scope.games = {};
		$scope.averages = [];

		TeamService.getTeams()
		.then(function(response) {
			for (var i = 0; i < response.data.obj.length; i++) {
				var team = {
					id: response.data.obj[i]._id,
					name: response.data.obj[i].name,
					players: response.data.obj[i].players ? response.data.obj[i].players : [],
				};
				$scope.teams[team.id] = team;
			}
		});

		$scope.changeSort = function(type) {
			if (type == "FG%") {
				$scope.sortType = "fgp";
			} else if (type == "3P%") {
				$scope.sortType = "tpp";
			} else {
				$scope.sortType = type.toLowerCase();
			}
			$scope.sortReverse = !$scope.sortReverse;
		};

		$scope.checkSort = function(type) {
			if (type == "FG%") {
				return $scope.sortType == "fgp";
			} else if (type == "3P%") {
				return $scope.sortType == "tpp";
			} else {
				return $scope.sortType == type.toLowerCase();
			}
		}

		$scope.getPlayersByTeam = function(team) {
			// delete $scope.averages;
			// $scope.averages = {};
			$scope.averages.length = 0;
			PlayerService.getPlayersByTeam(team)
			.then(function(response) {
				var obj = response.data.obj;
				for (var i = 0; i < obj.length; i++) {
					var player = {
						id: obj[i]._id,
						name: obj[i].name,
						team: obj[i].team,
						games: obj[i].games,
					}
					var gp=0, pts=0, reb=0, ast=0, stl=0, blk=0, tov=0, fgm=0, fga=0, tpm=0, tpa=0;
					for (var j = 0; j < player.games.length; j++) {
						gp++;
						pts += player.games[j].pts;
						reb += player.games[j].reb;
						ast += player.games[j].ast;
						stl += player.games[j].stl;
						blk += player.games[j].blk;
						tov += player.games[j].tov;
						fgm += player.games[j].fgm;
						fga += player.games[j].fga;
						tpm += player.games[j].tpm;
						tpa += player.games[j].tpa;
					}
					if (gp != 0) {
						pts = (pts / gp);
						reb = (reb / gp);
						ast = (ast / gp);
						stl = (stl / gp);
						blk = (blk / gp);
						tov = (tov / gp);
					}
					var fgp = fga != 0 ? (fgm / fga) : 0;
					var tpp = tpa != 0 ? (tpm / tpa) : 0;
					// $scope.averages[player.id] = [player.name, player.team.name, gp, pts, reb, ast, blk, stl, tov, fgp, tpp];
					var average = {
						name: player.name,
						team: player.team.name,
						gp: gp,
						ppg: pts,
						rpg: reb,
						apg: ast,
						blkpg: blk,
						spg: stl,
						topg: tov,
						fgp: fgp,
						tpp: tpp,
					};
					$scope.averages.push(average);
				}
			});
		};
	}
]);