module.exports = function($scope, UserServ, $location){
  $scope.facebookMessage = ''
  $scope.showFacebookMessage = false;
  $scope.googlePlusMessage = ''
  $scope.showGooglePlusMessage = false;

  if($location.search().facebookId){
    UserServ.setFacebookId($location.search().facebookId);
    $scope.connectsec = true;
  }

  if($location.search().googlePlusId){
    UserServ.setGooglePlusId($location.search().googlePlusId);
    $scope.connectsec = true;
  }

  if($location.search().auth === 'failed'){
    if($location.search().type === 'facebook'){
      $scope.facebookMessage = 'Failed authenticating with Facebook';
      $scope.showFacebookMessage = true;
    }else if($location.search().type === 'googlePlus') {
      $scope.googlePlusMessage = 'Failed authenticating with Google+';
      $scope.showGooglePlusMessage = true;
    }
    $scope.connectsec = true;
  }

  if($location.search().auth === 'success'){
    if($location.search().type === 'facebook'){
      $scope.facebookMessage = 'This Facebook account is already connected to a user';
      $scope.showFacebookMessage = true;
    }else if($location.search().type === 'googlePlus') {
      $scope.googlePlusMessage = 'This Google+ account is already connected to a user';
      $scope.showGooglePlusMessage = true;
    }
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

  UserServ.subscribeGooglePlusSuccess($scope, function(){
    $scope.googlePlusMessage = 'Successfully connected with Google+ , you can now login using Google+'
    $scope.showGooglePlusMessage = true;
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
  };

  $scope.connectGooglePlus = function(){
    UserServ.connectGooglePlus($scope.user._id);
  }
};