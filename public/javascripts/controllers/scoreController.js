myApp.controller('scoreController', 
	['$scope', '$location', 'TeamService', 'PlayerService', 'GameService',
	function($scope, $location, TeamService, PlayerService, GameService) {
		$scope.homePlayer = {};
		$scope.homeStat = {};
		$scope.awayPlayer = {};
		$scope.awayStat = {};
		$scope.statLabels = ["PTS", "REB", "AST", "STL", "BLK", "TOV", "FGM", "FGA", "3PM", "3PA", "FG%", "3P%"];
		$scope.teamStatLabels = ["Field Goals", "Field Goal %", "3 Pointers", "3 Pointers %", "Assists", "Rebounds", "Turnovers", "Steals", "Blocks"];
		$scope.homeTeam = [];
		$scope.awayTeam = [];
		
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
			var tpm = array[id][8];
			var tpa = array[id][9];
			if (index == 6) {
				fgm = ++array[id][index];
				fga = ++array[id][index+1];
				array[id][10] = (fgm / fga).toFixed(3);
				array[id][0] += 2;
			} else if (index == 7) {
				fga = ++array[id][index];
				array[id][10] = (fgm / fga).toFixed(3);
			} else if (index == 8) {
				tpm = ++array[id][index];
				tpa = ++array[id][index+1];
				fgm = ++array[id][6];
				fga = ++array[id][7];
				array[id][11] = (tpm / tpa).toFixed(3);
				array[id][10] = (fgm / fga).toFixed(3);
				array[id][0] += 3;
			} else if (index == 9) {
				tpa = ++array[id][index];
				fga = ++array[id][7];
				array[id][11] = (tpm / tpa).toFixed(3);
				array[id][10] = (fgm / fga).toFixed(3);
			} else {
				array[id][index]++;
			}
		}

		function decrement(array, id, index) {
			var fgm = array[id][6];
			var fga = array[id][7];
			var tpm = array[id][8];
			var tpa = array[id][9];
			if (index == 6) {
				fgm = --array[id][index];
				fga = --array[id][index+1];
				array[id][10] = isNaN((fgm / fga).toFixed(3)) ? 0 : (fgm / fga).toFixed(3);
				array[id][0] -= 2;
			} else if (index == 7) {
				fga = --array[id][index];
				array[id][10] = isNaN((fgm / fga).toFixed(3)) ? 0 : (fgm / fga).toFixed(3);
			} else if (index == 8) {
				tpm = --array[id][index];
				tpa = --array[id][index+1];
				fgm = --array[id][6];
				fga = --array[id][7];
				array[id][11] = isNaN((tpm / tpa).toFixed(3)) ? 0 : (tpm / tpa).toFixed(3);
				array[id][10] = isNaN((fgm / fga).toFixed(3)) ? 0 : (fgm / fga).toFixed(3);
				array[id][0] -= 3;
			} else if (index == 9) {
				tpa = --array[id][index];
				fga = --array[id][7];
				array[id][11] = isNaN((tpm / tpa).toFixed(3)) ? 0 : (tpm / tpa).toFixed(3);
				array[id][10] = isNaN((fgm / fga).toFixed(3)) ? 0 : (fgm / fga).toFixed(3);
			} else {
				array[id][index]--;
			}
		}

		function updateTeamStat(array, teamArray) {
			var fgm = 0, fga = 0, tpm = 0, tpa = 0, ast = 0, reb = 0, tov = 0, stl = 0, blk = 0, pts = 0;
			for (var id in array) {
				fgm += array[id][6];
				fga += array[id][7];
				tpm += array[id][8];
				tpa += array[id][9];
				ast += array[id][2];
				reb += array[id][1];
				tov += array[id][5];
				stl += array[id][3];
				blk += array[id][4];
				pts += array[id][0];
			}
			teamArray[0] = fgm + " / " + fga;
			teamArray[1] = fga != 0 ? (fgm / fga * 100).toFixed(1) : 0;
			teamArray[2] = tpm + " / " + tpa;
			teamArray[3] = tpa != 0 ? (tpm / tpa * 100).toFixed(1) : 0;
			teamArray[4] = ast;
			teamArray[5] = reb;
			teamArray[6] = tov;
			teamArray[7] = stl;
			teamArray[8] = blk;
			teamArray[9] = pts;
		}

		$scope.add = function(array1, array2, array3, player) {
			array1[player.id] = player;
			array2[player.id] = [0,0,0,0,0,0,0,0,0,0,0,0];
			updateTeamStat(array2, array3);
		};

		$scope.remove = function(array1, array2, array3, player) {
			delete array1[player.id];
			delete array2[player.id];
			updateTeamStat(array2, array3);
		}

		$scope.increment = function(array1, array2, id, index) {
			increment(array1, id, index);
			updateTeamStat(array1, array2);
		};

		$scope.decrement = function(array1, array2, id, index) {
			decrement(array1, id, index);
			updateTeamStat(array1, array2);
		};

		$scope.checkGoalAttempt = function(array, id, index) {
			var fg = array[id][6] == array[id][7] && index == 7;
			var tg = array[id][8] == array[id][9] && index == 9;
			return fg || tg;
		};

		$scope.submit = function() {
			for (var index in $scope.homePlayer) {
				GameService.addGame(index, $scope.homeStat[index])
				.then(function(response) {

				});
			}
			delete $scope.homePlayer;
			delete $scope.homeStat;
			$scope.homePlayer = {};
			$scope.homeStat = {};
			$scope.homeTeam.splice(0, $scope.homeTeam.length);
			for (var index in $scope.awayPlayer) {
				GameService.addGame(index, $scope.awayStat[index])
				.then(function(response) {
					
				});
			}
			delete $scope.awayPlayer;
			delete $scope.awayStat;
			$scope.awayPlayer = {};
			$scope.awayStat = {};
			$scope.awayTeam.splice(0, $scope.awayTeam.length);
		};
		
		// var $table = $('.table');
		// var $fixedColumn = $table.clone().insertBefore($table).addClass('fixed-column');

		// $fixedColumn.find('th:not(:first-child),td:not(:first-child)').remove();

		// $fixedColumn.find('tr').each(function (i, elem) {
		// 	$(this).height($table.find('tr:eq(' + i + ')').height());
		// });
	}
]);