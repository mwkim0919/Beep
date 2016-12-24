myApp.controller('playersController', 
	['$scope', '$location', 'TeamService', 'PlayerService', 'GameService',
	function($scope, $location, TeamService, PlayerService, GameService) {
		$scope.sortType     = 'name';
		$scope.sortReverse  = false;
		$scope.sortGame = 'date';
		$scope.sortGameReverse = false;
		$scope.searchFish   = '';

		$scope.tableLabels = ["name", "team", "gp", "ppg", "rpg", "apg", "blkpg", "spg", "topg", "FG%", "3P%"];
		$scope.gameLabels = ["date", "pts", "reb", "ast", "stl", "blk", "tov", "fgm", "fga", "FG%", "3pm", "3pa", "3P%"];
		$scope.teams = {};
		$scope.players = {};
		$scope.games = {};
		$scope.averages = [];

		$scope.colors = ['#45b7cd', '#ff6384', '#4644ce', '#d31932'];

		$scope.chartLabels = [];
		$scope.ptsData = [[], []];
		$scope.rebastData = [[], [], [], []];
		$scope.stlblkData = [[], [], [], []];
		$scope.fgData = [[], []];
		$scope.options = {
			legend: {
				display: true,
				position: "right",
			},
			scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true
	                }
	            }]
	        }
		};
		$scope.ptsDatasetOverride = [
			{
				label: "Points",
				borderWidth: 1,
				type: 'bar'
			},
			{
				label: "Average",
				borderWidth: 3,
				type: 'line',
				fill: false,
			}
		];
		$scope.rebastDatasetOverride = [
			{
				label: "Rebounds",
				borderWidth: 1,
				type: 'bar'
			},
			{
				label: "Assists",
				borderWidth: 1,
				type: 'bar'
			},
			{
				label: "Rebound Average",
				borderWidth: 3,
				type: 'line',
				fill: false,
			},
			{
				label: "Assist Average",
				borderWidth: 3,
				type: 'line',
				fill: false,
			}
		];
		$scope.stlblkDatasetOverride = [
			{
				label: "Steals",
				borderWidth: 1,
				type: 'bar'
			},
			{
				label: "Blocks",
				borderWidth: 1,
				type: 'bar'
			},
			{
				label: "Steal Average",
				borderWidth: 3,
				type: 'line',
				fill: false,
			},
			{
				label: "Block Average",
				borderWidth: 3,
				type: 'line',
				fill: false,
			}
		];
		$scope.fgDatasetOverride = [
			{
				label: "FG%",
				borderWidth: 1,
				type: 'bar'
			},
			{
				label: "3P%",
				borderWidth: 1,
				type: 'bar'
			},
		];

		function addDatatoChart(dataArray1, dataArray2, dataArray3, dataArray4, gameArray, average) {
			var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			for (var i = 0; i < dataArray1.length; i++) {
				dataArray1[i].length = 0;
			}
			for (var i = 0; i < dataArray2.length; i++) {
				dataArray2[i].length = 0;
			}
			for (var i = 0; i < dataArray3.length; i++) {
				dataArray3[i].length = 0;
			}
			for (var i = 0; i < dataArray4.length; i++) {
				dataArray4[i].length = 0;
			}
			$scope.chartLabels.length = 0;
			for (var i = 0; i < gameArray.length; i++) {
				var fgp = gameArray[i].fga != 0 ? gameArray[i].fgm / gameArray[i].fga : 0;
				var tpp = gameArray[i].tpa != 0 ? gameArray[i].tpm / gameArray[i].tpa : 0;
				var date = new Date(gameArray[i].date);
				var dateString = date.toString().substring(4, 21);
				console.log(dateString);
				dataArray1[0].push(gameArray[i].pts);
				dataArray1[1].push(average.ppg);
				dataArray2[0].push(gameArray[i].reb);
				dataArray2[1].push(gameArray[i].ast);
				dataArray2[2].push(average.rpg);
				dataArray2[3].push(average.apg);
				dataArray3[0].push(gameArray[i].stl);
				dataArray3[1].push(gameArray[i].blk);
				dataArray3[2].push(average.spg);
				dataArray3[3].push(average.blkpg);
				dataArray4[0].push(fgp);
				dataArray4[1].push(tpp);
				$scope.chartLabels.push(dateString);
			}
		}

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

		$scope.sortGames = function(type) {
			if (type == "FG%") {
				$scope.sortGame = "fgp";
			} else if (type == "3P%") {
				$scope.sortGame = "tpp";
			} else if (type == "3pm") {
				$scope.sortGame = "tpm";
			} else if (type == "3pa") {
				$scope.sortGame = "tpa";
			} else {
				$scope.sortGame = type.toLowerCase();
			}
			$scope.sortGameReverse = !$scope.sortGameReverse;
		};

		$scope.checkSortGames = function(type) {
			if (type == "FG%") {
				return $scope.sortGame == "fgp";
			} else if (type == "3P%") {
				return $scope.sortGame == "tpp";
			} else if (type == "3pm") {
				return $scope.sortGame == "tpm";
			} else if (type == "3pa") {
				return $scope.sortGame == "tpa";
			} else {
				return $scope.sortGame == type.toLowerCase();
			}
		};

		$scope.sortPlayers = function(type) {
			if (type == "FG%") {
				$scope.sortType = "fgp";
			} else if (type == "3P%") {
				$scope.sortType = "tpp";
			} else {
				$scope.sortType = type.toLowerCase();
			}
			$scope.sortReverse = !$scope.sortReverse;
		};

		$scope.checkSortPlayers = function(type) {
			if (type == "FG%") {
				return $scope.sortType == "fgp";
			} else if (type == "3P%") {
				return $scope.sortType == "tpp";
			} else {
				return $scope.sortType == type.toLowerCase();
			}
		};

		$scope.getPlayersByTeam = function(team) {
			$scope.playerName = null;
			$scope.playerDetail = null;
			delete $scope.players;
			$scope.players = {};
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
					$scope.players[player.id] = player;
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
						id: player.id,
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
		$scope.getPlayerDetail = function(player) {
			$scope.playerName = $scope.players[player.id].name;
			$scope.playerDetail = $scope.players[player.id].games;
			addDatatoChart($scope.ptsData, $scope.rebastData, $scope.stlblkData, $scope.fgData, $scope.players[player.id].games, player);
		}
	}
]);