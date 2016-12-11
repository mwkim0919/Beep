myApp.controller('dashController', 
	['$scope', '$location', 'AuthService', 'TeamService', 'PlayerService',
	function($scope, $location, AuthService, TeamService, PlayerService) {
		$scope.teams = [];
		$scope.players = [];

		$scope.getTeams = function() {
			TeamService.getTeams()
			.then(function(response) {
				for (var i = 0; i < response.data.obj.length; i++) {
					var team = {
		                id: response.data.obj[i]._id,
		                name: response.data.obj[i].name,
		                players: response.data.obj[i].players,
					};
					$scope.teams.push(team);
				}
			});
		};

		$scope.addTeam = function() {
			TeamService.addTeam($scope.teamName)
			.then(function(response) {
				var team = {
					name: $scope.teamName,
					players: [],
				};
				$scope.teams.push(team);
			})
		};

		$scope.addPlayer = function() {
			PlayerService.addPlayer($scope.playerName, $scope.playerTeam)
			.then(function(response) {
				var player = {
					name: $scope.playerName,
					team: $scope.playerTeam,
				};
				$scope.teams[$scope.teams.indexOf(playerTeam)].players.push(player);
				$scope.players.push(player);
			});
		};
	}
]);