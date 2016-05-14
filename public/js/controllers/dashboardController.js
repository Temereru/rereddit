app.controller('DashboardCtrl', ['$scope', 'UserServ', function($scope, UserServ){
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