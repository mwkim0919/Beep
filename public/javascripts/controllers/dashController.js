myApp.controller('dashController', 
	['$scope', '$location', 'AuthService', 'TeamService',
	function($scope, $location, AuthService, TeamService) {
		$scope.teams = [];
		
		$scope.data = [
			{name: 'Minwoo Kim', age: 27},
			{name: 'Ray Kim', age: 27},
			{name: 'Brian Son', age: 29},
			{name: 'DK Han', age: 24},
		];

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
	}
]);