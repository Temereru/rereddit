app.controller('UserCtrl', ['$scope', 'UserServ', '$location', function($scope, UserServ, $location){

  $scope.showErrMsg = false;

  if($location.search().facebookId){
    UserServ.loginFacebookId($scope, $location.search().facebookId);
  }
  if($location.search().auth === 'failure'){
    $scope.errMsg = 'Failed to authenticate with facebook';
    $scope.showErrMsg = true;
  }

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
  },

  $scope.loginWithFacebook = function(){
    UserServ.loginWithFacebook();
  }

}]);