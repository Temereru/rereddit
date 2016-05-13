app.controller('MainCtrl', ['$scope', 'posts', 'UserServ', function($scope, posts, UserServ){
  $scope.posts = posts.givePosts();
  $scope.title = '';
  $scope.link = '';

  posts.subscribePostsChange($scope, function(){
    $scope.posts = posts.givePosts();
  })

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
}]);