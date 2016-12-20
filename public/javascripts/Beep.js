var myApp = angular.module('Beep', ['ngRoute', 'chart.js']);

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

var $table = $('.table');
var $fixedColumn = $table.clone().insertBefore($table).addClass('fixed-column');

$fixedColumn.find('th:not(:first-child),td:not(:first-child)').remove();

$fixedColumn.find('tr').each(function (i, elem) {
  $(this).height($table.find('tr:eq(' + i + ')').height());
});