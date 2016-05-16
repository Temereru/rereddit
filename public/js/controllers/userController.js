app.controller('UserCtrl', ['$scope', 'UserServ', '$location', function($scope, UserServ, $location){

  $scope.showErrMsg = false;

  if($location.search().facebookId){
    UserServ.loginFacebookId($scope, $location.search().facebookId);
  }
  if($location.search().googlePlusId){
    UserServ.loginGooglePlusId($scope, $location.search().googlePlusId);
  }
  if($location.search().auth === 'failure'){
    if($location.search().type === 'facebook'){
      $scope.errMsg = 'Failed to authenticate with Facebook';
    }else if($location.search().type === 'googlePlus'){
      $scope.errMsg = 'Failed to authenticate with Google+';
    }
    
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
  $scope.loginWithGooglePlus = function(){
    UserServ.loginWithGooglePlus();
  }

}]);