app.controller('PostsCtrl', ['$scope', 'posts', '$stateParams', 'UserServ', function($scope, posts, $stateParams, UserServ) {
  $scope.id = $stateParams.id
  $scope.post = posts.givePost($scope.id);
  $scope.commentTitle = '';
  $scope.isLogged = UserServ.isLogged();

  posts.subscribePostsComment($scope, function(){
    $scope.post.comments = posts.givePostComments($scope.id);
  });

  UserServ.subscribeUserChange($scope, function(){
    $scope.isLogged = UserServ.isLogged();
  });

  $scope.addComment = function(){
    var comment = {
      title: $scope.commentTitle,
    }

    posts.addComment($scope.id, UserServ.getUserId(), comment, UserServ.getToken());
  };

  $scope.incrementUpvotes = function(comment){
    posts.upvoteComment($scope.id, comment._id, UserServ.getToken());
  }

  $scope.decrementUpvotes = function(comment){
    posts.downvoteComment($scope.id, comment._id, UserServ.getToken());
  }
}]);