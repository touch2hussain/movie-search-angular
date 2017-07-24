  var app = angular.module('myApp', ['ui.router']);
  
  app.run(function($rootScope, $location, $state, LoginService) {
    

    $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){ 

          if(toState.name == 'home' && localStorage.getItem("isLogged") == true) {
            $state.transitionTo('login');
          }
      });
    
      if(!LoginService.isAuthenticated()) {
        $state.transitionTo('login');
      }
  });
  
  app.config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
    $urlRouterProvider.otherwise('/login');

    $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain. **.
    'https://storage.googleapis.com/**',
    'https://storage.cloud.google.com/**'
  ]);

    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl : 'login.html',
        controller : 'LoginController'
      })
      .state('home', {
        url : '/home',
        templateUrl : 'home.html',
        controller : 'HomeController'
      });
  }]);

  app.controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService, $http) {
    $rootScope.title = "Movie Store";
      $scope.showLogout = false;
      if(localStorage.getItem("isLogged") == true) {
        $scope.showLogout = true;
      }

     $scope.doLogout = function() {
       //$rootScope.isLogged = false;
       localStorage.removeItem("isLogged");
       $scope.showLogout = false;
     }

    $scope.formSubmit = function() {
      if(LoginService.login($scope.username, $scope.password)) {
        //$rootScope.isLogged = true;
        localStorage.setItem('isLogged', true);

        $scope.error = '';
        $scope.username = '';
        $scope.password = '';
        $state.transitionTo('home');
      } else {
        $scope.error = "Incorrect username/password !";
      }   
    };  
    
  });
  
  app.controller('HomeController', function($scope, $rootScope, $stateParams, $state, LoginService, $http) {
    $scope.isLoading = true;
    $scope.closeModal = function(index) {
      var vid = document.getElementById('videoclip-'+index); 
       vid.pause(); 
      //videocontainer.pause();
      $('#myModal-'+index).modal('toggle');
    }

    if(!localStorage.getItem("isLogged") == true) {
      $state.transitionTo('login');
    }
    $rootScope.title = "Your Favourite Movies";
   
    var url = 'https://storage.googleapis.com/movie-database/movies-list.json';
    var data;
      $http.get(url).then(function (resp) {
            data = resp;
           $scope.movies=  resp.data.movies.list;
           $scope.isLoading = false;
     });

     $scope.doLogout = function() {
       //$rootScope.isLogged = false;
       localStorage.removeItem("isLogged");
       $state.transitionTo('login');
     }

  
    $scope.filterMovies = function(genre) {
        if(genre=='all') {
           $scope.search = '';
        } else {
          $scope.search = genre;
        }
        
    }
    
  });
  
  app.factory('LoginService', function() {
    var admin = 'admin';
    var pass = 'admin';
    var isAuthenticated = false;
    
    return {
      login : function(username, password) {
        isAuthenticated = username === admin && password === pass;
        return isAuthenticated;
      },
      isAuthenticated : function() {
        return isAuthenticated;
      }
    };
    
  });
  