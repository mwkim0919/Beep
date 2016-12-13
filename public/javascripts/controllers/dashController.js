myApp.controller('dashController', 
	['$scope', '$location', 'AuthService', 'TeamService', 'PlayerService',
	function($scope, $location, AuthService, TeamService, PlayerService) {
		$scope.teams = {};
		$scope.team = null;
		$scope.players = {};
		$scope.statLabels = ["Name", "GP", "PTS", "REB", "AST", "STL", "BLK", "TOV", "FGM", "FGA", "FG%", "3PM", "3PA", "3P%", "OREB", "DREB"];
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
					};
					// $scope.players.push(player);
					$scope.players[player.id] = player;
				}
				$scope.team = team;
			});
		}

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
					delete $scope.players[player.id]
					$scope.teams[teamId].players.splice($scope.teams[teamId].players.indexOf(player.id), 1);
				});
			}
		};

		$scope.labels = ["PTS", "AST", "REB", "BLK", "STL", "TOV", "FG%"];
		$scope.data = [
			[65, 59, 90, 81, 56, 55, 40],
			[28, 48, 40, 19, 96, 27, 100]
		];
		$scope.series = ["Player A", "AVERAGE"];
		$scope.options = {
			legend: {
				display: true,
				position: "top",
			},
			scale: {
                ticks: {
                    beginAtZero: true
                }
            },
		};
	}
]);