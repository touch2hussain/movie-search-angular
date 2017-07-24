app.controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService, $http) {
    $rootScope.title = "Movie'DB";
      var url = 'https://www.googleapis.com/storage/v1/b/movie-database/o/document.json';
      $scope.datas =  $http.get(url).then(function (resp) {
            var data=  resp.data.result;
     });

    $scope.formSubmit = function() {
      if(LoginService.login($scope.username, $scope.password)) {
        $scope.error = '';
        $scope.username = '';
        $scope.password = '';
        $state.transitionTo('home');
      } else {
        $scope.error = "Incorrect username/password !";
      }   
    };  
    
  });