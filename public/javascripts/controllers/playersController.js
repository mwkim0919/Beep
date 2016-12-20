myApp.controller('playersController', 
	['$scope', '$location', 'TeamService', 'PlayerService', 'GameService',
	function($scope, $location, TeamService, PlayerService, GameService) {
		$scope.tableLabels = ["Name", "Team", "GP", "PPG", "RPG", "APG", "BLKPG", "SPG", "TOPG", "FG%", "3P%"];
		$scope.teams = {};
		$scope.players = {};
		$scope.games = {};
		$scope.averages = {};

		
		PlayerService.getPlayers()
		.then(function(response) {
			for (var i = 0; i < response.data.obj.length; i++) {
				var player = {
					id: response.data.obj[i]._id,
					name: response.data.obj[i].name,
					team: response.data.obj[i].team,
					games: response.data.obj[i].games,
				};
				$scope.players[player.id] = player;
				console.log(player.games);
			}
		});
	}
]);