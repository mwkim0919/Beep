myApp.controller('scoreController', 
	['$scope', '$location', 'TeamService', 'PlayerService', 'GameService',
	function($scope, $location, TeamService, PlayerService, GameService) {
		$scope.homePlayer = {};
		$scope.homeStat = {};
		$scope.awayPlayer = {};
		$scope.awayStat = {};
		$scope.statLabels = ["Name", "PTS", "REB", "AST", "STL", "BLK", "TOV", "FGM", "FGA", "FG%", "3PM", "3PA", "3P%"];
		
		$scope.isEmpty = function(map) {
			for(var key in map) {
				if (map.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		}

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

		$scope.add = function(array1, array2, player) {
			array1[player.id] = player;
			array2[player.id] = [0,0,0,0,0,0,0,0,0,0,0,0];
		};

		$scope.remove = function(array, player) {
			delete array[player.id];
		}

		$scope.increment = function(array, id, index) {
			increment(array, id, index);
		};

		$scope.decrement = function(array, id, index) {
			decrement(array, id, index);
		};

		$scope.checkGoalAttempt = function(array, id, index) {
			var fg = array[id][6] == array[id][7] && index == 7;
			var tg = array[id][9] == array[id][10] && index == 10;
			return fg || tg;
		};

		$scope.submit = function() {
			for (var index in $scope.homePlayer) {
				GameService.addGame($scope.homePlayer[index], $scope.homeStat[index])
				.then(function(response) {

				});
			}
			for (var index in $scope.awayPlayer) {
				GameService.addGame($scope.awayPlayer[index], $scope.awayStat[index])
				.then(function(response) {

				});
			}
		}
	}
]);