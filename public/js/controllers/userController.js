app.controller('UserCtrl', ['$scope', 'UserServ',function($scope, UserServ){

  $scope.username = '';
  $scope.password = '';

  $scope.signup = function(){
    var user = {
      username: $scope.username,
      password: $scope.password
    }
    UserServ.register(user);
  }

}]);