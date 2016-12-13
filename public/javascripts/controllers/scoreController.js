myApp.controller('scoreController', 
	['$scope', '$location', 'AuthService', 'TeamService', 'PlayerService',
	function($scope, $location, AuthService, TeamService, PlayerService) {
		$scope.homePlayer = {};
		$scope.homeStat = {};
		$scope.away = {};
		$scope.statLabels = ["Name", "PTS", "REB", "AST", "STL", "BLK", "TOV", "FGM", "FGA", "FG%", "3PM", "3PA", "3P%"];
		
		function increment(array, id, index) {
			var fgm = array[id][6];
			var fga = array[id][7];
			var tpm = array[id][9];
			var tpa = array[id][10];
			if (index == 6) {
				fgm = ++array[id][index];
				fga = ++array[id][index+1];
				array[id][8] = Math.round(fgm / fga * 100);
				array[id][0] += 2;
			} else if (index == 7) {
				fga = ++array[id][index];
				array[id][8] = Math.round(fgm / fga * 100);
			} else if (index == 9) {
				tpm = ++array[id][index];
				tpa = ++array[id][index+1];
				fgm = ++array[id][6];
				fga = ++array[id][7];
				array[id][11] = Math.round(tpm / tpa * 100);
				array[id][8] = Math.round(fgm / fga * 100);
				array[id][0] += 3;
			} else if (index == 10) {
				tpa = ++array[id][index];
				fga = ++array[id][7];
				array[id][11] = Math.round(tpm / tpa * 100);
				array[id][8] = Math.round(fgm / fga * 100);
			} else {
				array[id][index]++;
			}
		}

		function decrement(array, id, index) {
			var fgm = array[id][6];
			var fga = array[id][7];
			var tpm = array[id][9];
			var tpa = array[id][10];
			if (index == 6) {
				fgm = --array[id][index];
				fga = --array[id][index+1];
				array[id][8] = isNaN(Math.round(fgm / fga * 100)) ? 0 : Math.round(fgm / fga * 100);
				array[id][0] -= 2;
			} else if (index == 7) {
				fga = --array[id][index];
				array[id][8] = isNaN(Math.round(fgm / fga * 100)) ? 0 : Math.round(fgm / fga * 100);
			} else if (index == 9) {
				tpm = --array[id][index];
				tpa = --array[id][index+1];
				fgm = --array[id][6];
				fga = --array[id][7];
				array[id][11] = isNaN(Math.round(tpm / tpa * 100)) ? 0 : Math.round(tpm / tpa * 100);
				array[id][8] = isNaN(Math.round(fgm / fga * 100)) ? 0 : Math.round(fgm / fga * 100);
				array[id][0] -= 3;
			} else if (index == 10) {
				tpa = --array[id][index];
				fga = --array[id][7];
				array[id][11] = isNaN(Math.round(tpm / tpa * 100)) ? 0 : Math.round(tpm / tpa * 100);
				array[id][8] = isNaN(Math.round(fgm / fga * 100)) ? 0 : Math.round(fgm / fga * 100);
			} else {
				array[id][index]--;
			}
		}

		$scope.addHome = function(player) {
			$scope.homePlayer[player.id] = player;
			$scope.homeStat[player.id] = [0,0,0,0,0,0,0,0,0,0,0,0];
		};

		$scope.increment = function(id, index) {
			increment($scope.homeStat, id, index);
		};

		$scope.decrement = function(id, index) {
			decrement($scope.homeStat, id, index);
		};

		$scope.checkGoalAttempt = function(array, id) {
			return array[id][6] == array[id][7] || array[id][9] == array[id][10];
		};
	}
]);