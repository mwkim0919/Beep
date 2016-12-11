myApp.factory('TeamService',
  ['$q', '$timeout', '$http',
  function($q, $timeout, $http) {

    // create user variable
    var teams = [];

    return ({
      getTeams: getTeams,
      addTeam: addTeam,
      removeTeam: removeTeam,
      editTeam: editTeam
    });

    function getTeams() {
      return $http.get('/teams')
      // handle success
      .success(function(data) {
        // DO something
      })
      // handle error
      .error(function(data) {
        // DO something
      });
    }

    function addTeam(name) {
      return $http.post('/teams',
        {
          name: name, 
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
    
    function removeTeam(id) {
      return $http.delete('/teams/' + id)
      // handle success
      .success(function(status) {
        // DO something
      })
      // handle error
      .error(function(status) {
        // DO something
      });
    }

    function editTeam(id, date, category, description, type, amount) {
      return $http.patch('/teams/' + id,
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