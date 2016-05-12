app.controller('UserCtrl', ['$scope', 'UserServ',function($scope, UserServ){

  $scope.userForm = {
    username: '',
    password: ''
  }

  $scope.signup = function(){
    UserServ.register($scope.userForm);
  }

  $scope.login = function(){
    UserServ.login($scope.userForm);
  }

}]);