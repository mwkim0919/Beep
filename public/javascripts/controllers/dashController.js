myApp.controller('dashController', 
	['$scope', '$location', 'AuthService', 'TeamService', 'PlayerService', 'GameService',
	function($scope, $location, AuthService, TeamService, PlayerService, GameService) {
		$scope.teams = {};
		$scope.team = null;
		$scope.players = {};
		$scope.statLabels = ["Name", "Team", "GP", "PTS", "REB", "AST", "STL", "BLK", "TOV", "FGM", "FGA", "FG%", "3PM", "3PA", "3P%", ""];
		$scope.stats = {};

		$scope.getTeams = function() {
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
		};

		$scope.getPlayersByTeam = function(team) {
			PlayerService.getPlayersByTeam(team)
			.then(function(response) {
				delete $scope.players;
				$scope.players = {};
				for (var i = 0; i < response.data.obj.length; i++) {
					var player = {
						id: response.data.obj[i]._id,
						name: response.data.obj[i].name,
						games: response.data.obj[i].games,
						team: team,
					};
					$scope.players[player.id] = player;
				}
				$scope.team = team;
			});
			TeamService.getTeamStat(team)
			.then(function(response) {
				var gp=0, pts=0, reb=0, ast=0, stl=0, blk=0, tov=0, fgm=0, fga=0, fgp=0, tpm=0, tpa=0, tpp=0;
				for (var i = 0; i < response.data.obj.length; i++) {
					gp += 1;
					pts += response.data.obj[i].pts;
					reb += response.data.obj[i].reb;
					ast += response.data.obj[i].ast;
					stl += response.data.obj[i].stl;
					blk += response.data.obj[i].blk;
					tov += response.data.obj[i].tov;
					fgm += response.data.obj[i].fgm;
					fga += response.data.obj[i].fga;
					tpm += response.data.obj[i].tpm;
					tpa += response.data.obj[i].tpa;
				}
				if (gp != 0) {
					pts = (pts / gp).toFixed(1);
					reb = (reb / gp).toFixed(1);
					ast = (ast / gp).toFixed(1);
					stl = (stl / gp).toFixed(1);
					blk = (blk / gp).toFixed(1);
					tov = (tov / gp).toFixed(1);
				}
				fgp = fga != 0 ? (fgm / fga).toFixed(3) : 0;
				tpp = tpa != 0 ? (tpm / tpa).toFixed(3) : 0;
				var stat = ["-", team.name, "-", pts, reb, ast, stl, blk, tov, fgm, fga, fgp, tpm, tpa, tpp];
				$scope.stats[team.id] = stat;
			});
		};

		$scope.addPlayerStat = function(player) {
			GameService.getGamesByPlayer(player)
			.then(function(response) {
				var gp=0, pts=0, reb=0, ast=0, stl=0, blk=0, tov=0, fgm=0, fga=0, fgp=0, tpm=0, tpa=0, tpp=0;
				for (var i = 0; i < response.data.obj.length; i++) {
					gp += 1;
					pts += response.data.obj[i].pts;
					reb += response.data.obj[i].reb;
					ast += response.data.obj[i].ast;
					stl += response.data.obj[i].stl;
					blk += response.data.obj[i].blk;
					tov += response.data.obj[i].tov;
					fgm += response.data.obj[i].fgm;
					fga += response.data.obj[i].fga;
					tpm += response.data.obj[i].tpm;
					tpa += response.data.obj[i].tpa;
				}
				if (gp != 0) {
					pts = (pts / gp).toFixed(1);
					reb = (reb / gp).toFixed(1);
					ast = (ast / gp).toFixed(1);
					stl = (stl / gp).toFixed(1);
					blk = (blk / gp).toFixed(1);
					tov = (tov / gp).toFixed(1);
				}
				fgp = fga != 0 ? (fgm / fga).toFixed(3) : 0;
				tpp = tpa != 0 ? (tpm / tpa).toFixed(3) : 0;
				var stat = [player.name, player.team.name, gp, pts, reb, ast, stl, blk, tov, fgm, fga, fgp, tpm, tpa, tpp];
				$scope.stats[player.id] = stat;
			});
		};

		$scope.removeStat = function(id) {
			delete $scope.stats[id];
		};

		$scope.addTeam = function() {
			TeamService.addTeam($scope.teamName)
			.then(function(response) {
				var team = {
					id: response.data.obj._id,
					name: $scope.teamName,
					players: [],
				};
				$scope.teams[team.id] = team;
				$scope.teamName = "";
			});
		};

		$scope.removeTeam = function(team) {
			var r = confirm("Are you sure that you want to delete this team?\nAll information in this team will be deleted.");
			if (r == true) {
				TeamService.removeTeam(team.id)
				.then(function(response) {
					if ($scope.team == team) {
						$scope.team = null;
					}
					delete $scope.teams[team.id];
					for (var id in $scope.stats) {
						if ($scope.stats[id][1] == team.name) {
							delete $scope.stats[id];
						}
					}
				});
			}
		}

		$scope.addPlayer = function() {
			PlayerService.addPlayer($scope.playerName, $scope.playerTeam)
			.then(function(response) {
				var player = {
					id: response.data.obj._id,
					name: $scope.playerName,
					team: $scope.playerTeam ? $scope.playerTeam : null,
					games: [],
				};
				if ($scope.playerTeam) {
					$scope.teams[$scope.playerTeam].players.push(player);
				}
				if ($scope.team == $scope.teams[$scope.playerTeam]) {
					$scope.players[player.id] = player;
				}
				$scope.playerName = "";
				$scope.playerTeam = "";
			});
		};

		$scope.removePlayer = function(player) {
			var r = confirm("Are you sure that you want to delete this player?\nAll information in this player will be deleted.");
			if (r == true) {
				PlayerService.removePlayer(player.id)
				.then(function(response) {
					var teamId = response.data.obj.team;
					delete $scope.players[player.id];
					delete $scope.stats[player.id];
					$scope.teams[teamId].players.splice($scope.teams[teamId].players.indexOf(player.id), 1);
				});
			}
		};

		$scope.radarLabels = ["PTS", "AST", "REB", "BLK", "STL", "TOV", "FG%"];
		$scope.radarData = [
			[0, 0, 0, 0, 0, 0, 0],
			// [28, 48, 40, 19, 96, 27, 100]
		];
		$scope.radarSeries = [];
		$scope.radarOptions = {
			legend: {
				display: true,
				position: "top",
			},
			scale: {
                ticks: {
                    beginAtZero: true,
                    max: 100,
                }
            },
		};

		$scope.labels = ["PTS", "AST", "REB", "BLK", "STL", "TOV", "FG%"];
		$scope.series = ['Series A', 'Series B'];

		$scope.data = [
			[65, 59, 80, 81, 56, 55, 40],
			[28, 48, 40, 19, 86, 27, 90]
		];

		$scope.barOptions = {
			legend: {
				display: true,
				position: "top",
			}
		};
	}
]);