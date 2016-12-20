myApp.factory('GameService',
  ['$q', '$timeout', '$http',
  function($q, $timeout, $http) {

    // create user variable
    var games = [];

    return ({
      getGames: getGames,
      getGamesByPlayer: getGamesByPlayer,
      addGame: addGame,
      removeGame: removeGame,
      editGame: editGame
    });

    function getGames() {
      return $http.get('/games')
      // handle success
      .success(function(data) {
        // DO something
      })
      // handle error
      .error(function(data) {
        // DO something
      });
    }

    function getGamesByPlayer(player) {
      return $http.get('/games/player/' + player.id)
      .success(function(data) {

      })
      .error(function(data) {

      });
    }

    function addGame(player, array) {
      return $http.post('/games',
        {
          player: player,
          date: new Date(),
          opponent: null,
          pts: array[0],
          reb: array[1],
          ast: array[2],
          stl: array[3],
          blk: array[4],
          tov: array[5],
          fgm: array[6],
          fga: array[7],
          tpm: array[8],
          tpa: array[9],
          min: null,
        }
      )
      // handle success
      .success(function(data, status) {
        if (status === 201 && data.status) {
          // DO something
        }
      })
      .error(function(data) {
        // DO something
      });
    }
    
    function removeGame(id) {
      return $http.delete('/games/' + id)
      // handle success
      .success(function(status) {
        // DO something
      })
      // handle error
      .error(function(status) {
        // DO something
      });
    }

    function editGame(id, date, category, description, type, amount) {
      return $http.patch('/games/' + id,
        {
          date: date,
          category: category,
          description: description,
          type: type,
          amount: amount,
        }
      )
      // handle success
      .success(function(status) {
        // DO something
      })
      // handle error
      .error(function(status) {

      });
    }

}]);