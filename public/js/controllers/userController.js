app.controller('UserCtrl', ['$scope', 'UserServ',function($scope, UserServ){

  $scope.userForm = {
    username: '',
    email: '',
    password: ''
  }

  $scope.signup = function(){ 
    UserServ.register($scope.userForm);
  }

  $scope.login = function(){
    var user = {
      username: $scope.userForm.username,
      password: $scope.userForm.password
    };
    UserServ.login($scope.userForm);
  }

}]);