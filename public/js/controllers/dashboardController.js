app.controller('DashboardCtrl', ['$scope', 'UserServ', '$location', function($scope, UserServ, $location){
  $scope.facebookMessage = ''
  $scope.showFacebookMessage = false;

  if($location.search().facebookId){
    UserServ.setFacebookId($location.search().facebookId);
    $scope.connectsec = true;
  }

  if($location.search().auth === 'failed'){
    $scope.facebookMessage = 'Failed authenticating with facebook';
    $scope.showFacebookMessage = true;
    $scope.connectsec = true;
  }

  if($location.search().auth === 'success'){
    $scope.facebookMessage = 'This Facebook Account is already connected to a user';
    $scope.showFacebookMessage = true;
    $scope.connectsec = true;
  }

  $scope.user = UserServ.getFullUserData();
  $scope.posts = [];

  UserServ.subscribeUserPosts($scope, function(){
    $scope.posts = UserServ.giveUserPosts();
  });

  UserServ.subscribeUserChange($scope, function(){
    $scope.user = UserServ.getFullUserData();
  });

  UserServ.subscribePasswordChange($scope, function(){
    $scope.passwordMessage = 'Password was Successfully changed'
    $scope.showPasswordMessage = true;
  })

  UserServ.subscribeFacebookSuccess($scope, function(){
    $scope.facebookMessage = 'Successfully connected with facebook, you can now login using facebook'
    $scope.showFacebookMessage = true;
    $scope.connectsec = true;
  })

  UserServ.getUserPosts($scope.user._id);

  $scope.changable = {
    profUrl: '',
    email: '',
    oldPass: '',
    newPass: ''
  }

  $scope.changeProfilePicture = function(){
    UserServ.changeProfilePicture($scope.user._id, $scope.changable.profUrl);
  };

  $scope.changeEmail = function(){
    UserServ.changeEmail($scope.user._id, $scope.changable.email);
  };

  $scope.changePassword = function(){
    UserServ.changePassword($scope.user._id, $scope.changable.oldPass, $scope.changable.newPass);
  };

  $scope.connectFacebook = function(){
    UserServ.connectFacebook($scope.user._id);
  }
}]);