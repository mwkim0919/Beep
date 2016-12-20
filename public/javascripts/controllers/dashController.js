myApp.controller('dashController', 
	['$scope', '$location', 'AuthService', 'TeamService', 'PlayerService', 'GameService',
	function($scope, $location, AuthService, TeamService, PlayerService, GameService) {
		$scope.teams = {};
		$scope.team = null;
		$scope.players = {};
		$scope.statLabels = ["Name", "Team", "GP", "PTS", "REB", "AST", "STL", "BLK", "TOV", "FGM", "FGA", "FG%", "3PM", "3PA", "3P%", ""];
		$scope.stats = {};
		$scope.allStat = [[],[],[],[],[],[]];

		$scope.radarLabels = ["PTS", "REB", "AST", "STL", "BLK", "TOV"];
		$scope.radarData = [
			[0, 0, 0, 0, 0, 0],
		];
		$scope.radarSeries = [];
		var radarIds = [];
		$scope.colors = ["rgba(159,204,0,0.5)","rgba(250,109,33,0.7)","rgba(154,154,154,0.5)"];
		$scope.radarOptions = {
			// responsive: false,
			legend: {
				display: true,
				position: "right",
			},
			scale: {
                ticks: {
                    beginAtZero: true,
                    max: 100,
                }
            },
		};
		//=============================================================================//
		$scope.barOptions = {
			scaleBeginAtZero: true,
			legend: {
				display: true,
				position: "top",
			},
			scale: {
				xAxes: [{
	                ticks: {
	                	beginAtZero: true,
	                    max: 100,
	                    min: 0,
	                    // stepSize: 0.5
	                }
	            }]
            },
		};

		function getPercentile(sortedArray, v) {
			var l = 0, s = 0, i = 0;
			while (i < sortedArray.length || sortedArray[i] <= v) {
				if (sortedArray[i] < v) {
					l++;
				} else if (sortedArray[i] == v) {
					s++;
				}
				i++;
			}
			return (l + (0.5 * s)) / sortedArray.length * 100;
		}

		function addDatatoRadar(seriesArray, dataArray, idArray, data, name, id) {
			if (idArray.length == 0) {
				idArray.push(id);
				seriesArray[0] = name;
				dataArray[0][0] = getPercentile($scope.allStat[0].sort(), data[3]);
				dataArray[0][1] = getPercentile($scope.allStat[1].sort(), data[4]);
				dataArray[0][2] = getPercentile($scope.allStat[2].sort(), data[5]);
				dataArray[0][3] = getPercentile($scope.allStat[3].sort(), data[6]);
				dataArray[0][4] = getPercentile($scope.allStat[4].sort(), data[7]);
				dataArray[0][5] = 100-getPercentile($scope.allStat[5].sort().reverse(), data[8]);
			} else if (idArray.indexOf(id) == -1 && idArray.length > 0) {
				idArray.push(id);
				seriesArray.push(name);
				var percentiles = [
					getPercentile($scope.allStat[0].sort(), data[3]),
					getPercentile($scope.allStat[1].sort(), data[4]),
					getPercentile($scope.allStat[2].sort(), data[5]),
					getPercentile($scope.allStat[3].sort(), data[6]),
					getPercentile($scope.allStat[4].sort(), data[7]),
					100-getPercentile($scope.allStat[5].sort().reverse(), data[8])
				];
				dataArray.push(percentiles);
			}
		}

		function clearRadarData(dataArray, allStatArray) {
			var length = dataArray.length;
			for (var i = 1; i < length; i++) {
				dataArray.pop();
			}
			for (var j = 0; j < dataArray.length; j++) {
				dataArray[0][j] = 0;
			}
			for (var k = 0; k < allStatArray.length; k++) {
				allStatArray[k].length = 0;
			}
		}

		function getPlayersByTeam(team) {
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
		}

		function removeRadarData(seriesArray, dataArray, idArray, id) {
			var index = radarIds.indexOf(id);
			seriesArray.splice(index, 1);
			dataArray.splice(index, 1);
			radarIds.splice(index, 1);
			if (radarIds.length == 0) {
				dataArray[0] = [0, 0, 0, 0, 0, 0];
				seriesArray[0] = "";
			}
		}

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
			getPlayersByTeam(team);
		}

		$scope.getTeamInfo = function(team) {
			getPlayersByTeam(team);
			TeamService.getTeamStat(team)
			.then(function(response) {
				delete $scope.stats;
				$scope.stats = {};
				$scope.radarSeries.length = 0;
				radarIds.length = 0;
				clearRadarData($scope.radarData, $scope.allStat);
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
					$scope.allStat[0].push(response.data.obj[i].pts);
					$scope.allStat[1].push(response.data.obj[i].reb);
					$scope.allStat[2].push(response.data.obj[i].ast);
					$scope.allStat[3].push(response.data.obj[i].stl);
					$scope.allStat[4].push(response.data.obj[i].blk);
					$scope.allStat[5].push(response.data.obj[i].tov);
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
				addDatatoRadar($scope.radarSeries, $scope.radarData, radarIds, stat, team.name, team.id);
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
				addDatatoRadar($scope.radarSeries, $scope.radarData, radarIds, stat, player.name, player.id);
			});
		};

		$scope.removeStat = function(id) {
			delete $scope.stats[id];
			removeRadarData($scope.radarSeries, $scope.radarData, radarIds, id);
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
			// CLEAR OUT PLAYER LIST WHEN PLAYERS IN THE TEAM IS DELETED.
			var r = confirm("Are you sure that you want to delete this team?\nAll information in this team will be deleted.");
			if (r == true) {
				TeamService.removeTeam(team.id)
				.then(function(response) {
					if ($scope.team == team) {
						$scope.team = null;
						delete $scope.players;
						$scope.players = {};
					}
					delete $scope.teams[team.id];
					for (var id in $scope.stats) {
						if ($scope.stats[id][1] == team.name) {
							delete $scope.stats[id];
						}
					}
					removeRadarData($scope.radarSeries, $scope.radarData, radarIds, team.id);
					for (var i in response.data.obj.players) {
						removeRadarData($scope.radarSeries, $scope.radarData, radarIds, response.data.obj.players[i]._id);
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
					removeRadarData($scope.radarSeries, $scope.radarData, radarIds, player.id);
				});
			}
		};
	}
]);