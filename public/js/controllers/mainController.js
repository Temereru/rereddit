app.controller('MainCtrl', ['$scope', 'posts', 'UserServ', function($scope, posts, UserServ){
  $scope.posts = posts.givePosts();
  $scope.title = '';
  $scope.link = '';
  $scope.isLogged = UserServ.isLogged();

  posts.subscribePostsChange($scope, function(){
    $scope.posts = posts.givePosts();
  });

  UserServ.subscribeUserChange($scope, function(){
    $scope.isLogged = UserServ.isLogged();
  });

  $scope.addPost = function(){
    var post = {
      user: UserServ.getUserId(),
      title: $scope.title,
      link: $scope.link,
      upvotes: 0,
      comments: []
    };
    posts.sendPost(post, UserServ.getToken());
  };

  $scope.incrementUpvotes = function(post){
    posts.upvote(post._id, UserServ.getToken());
  }

  $scope.decrementUpvotes = function(post){
    posts.downvote(post._id, UserServ.getToken());
  }
}]);