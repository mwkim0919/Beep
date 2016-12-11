myApp.controller('userController', 
	['$scope', '$location', 'AuthService', 
	function($scope, $location, AuthService) {
		$scope.current_user = AuthService.getCurrentUserName();
		
		$scope.login = function() {
			AuthService.login($scope.signin.email, $scope.signin.password)
	        // handle success
	        .then(function () {
	        	$location.path('/dashboard');
	        	$scope.signin = {};
	        })
	        // handle error
	        .catch(function () {
	        	$scope.errorMessage = "Invalid username and/or password";
	        });
	    };

	    $scope.signup = function() {
	    	AuthService.register($scope.register.Email, $scope.register.Password)
	    	.then(function() {
	    		$location.path('/dashboard');
	    		$scope.register = {};
	    	})
	    	.catch(function() {

	    	});
	    };

	    $scope.logout = function() {
	    	AuthService.logout()
	    	.then(function() {
	    		$location.path('/');
	    	});
	    };

	}
]);