var myApp = angular.module('Beep', ['ngRoute', 'chart.js', 'angularUtils.directives.dirPagination']);

myApp.config(function ($routeProvider) {

  $routeProvider
  .when('/', {
    templateUrl: 'templates/signin.html',
    controller: 'userController',
    access: {restricted: false}
  })

  .when('/signup', {
    templateUrl: 'templates/signup.html',
    controller: 'userController',
    access: {restricted: false}
  })

  .when('/signout', {
    controller: 'userController',
    access: {restricted: true}
  })
  
  .when('/dashboard', {
    templateUrl: 'templates/dashboard.html',
    controller: 'dashController',
    access: {restricted: true}
  })

  .when('/scorekeep', {
    templateUrl: 'templates/scorekeep.html',
    controller: 'scoreController',
    access: {restricted: true}
  })

  .when('/players', {
    templateUrl: 'templates/players.html',
    controller: 'playersController',
    access: {restricted: true}
  })
  
  .otherwise({
    redirectTo: '/'
  });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/');
          $route.reload();
        } else if (!next.access.restricted && AuthService.isLoggedIn()) {
          $location.path('/dashboard');
          $route.reload();
        }
      });
    });
});