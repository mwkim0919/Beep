myApp.factory('PlayerService',
  ['$q', '$timeout', '$http',
  function($q, $timeout, $http) {

    // create user variable
    var players = [];

    return ({
      getPlayers: getPlayers,
      addPlayer: addPlayer,
      removePlayer: removePlayer,
      editPlayer: editPlayer
    });

    function getPlayers() {
      return $http.get('/players')
      // handle success
      .success(function(data) {
        // DO something
      })
      // handle error
      .error(function(data) {
        // DO something
      });
    }

    function addPlayer(name, team) {
      return $http.post('/players',
        {
          name: name,
          team: team ? team : null, 
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
    
    function removePlayer(id) {
      return $http.delete('/players/' + id)
      // handle success
      .success(function(status) {
        // DO something
      })
      // handle error
      .error(function(status) {
        // DO something
      });
    }

    function editPlayer(id, date, category, description, type, amount) {
      return $http.patch('/players/' + id,
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