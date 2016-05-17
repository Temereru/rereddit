module.exports = function($scope, UserServ){

  $scope.getUserData = function(){
    $scope.currentUsername = UserServ.getUsername();
    $scope.isLogged = UserServ.isLogged();
  }
  $scope.getUserData();
  UserServ.subscribeUserChange($scope, $scope.getUserData);

  $scope.logout = function(){
    UserServ.logout();
  }
};